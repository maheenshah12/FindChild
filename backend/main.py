from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from datetime import datetime
from typing import Optional
import uuid
import shutil
import cloudinary
import cloudinary.uploader

from config import settings
from database import init_db, cases_collection, responses_collection, whatsapp_groups_collection
from models import MissingChildCase, CaseStatus, Gender, StatusUpdate
from agent import generate_missing_alert
from whatsapp_waapi import broadcast_to_groups_waapi, handle_incoming_message_waapi, get_waapi_status

app = FastAPI(title="FindChildd API")

# Configure Cloudinary if credentials are provided
if settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret:
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret
    )
    print("[INFO] Cloudinary configured for image uploads")
else:
    print("[WARNING] Cloudinary not configured - images will be stored locally")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://findchildd-frontend.onrender.com",  # Replace with your actual Render frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
os.makedirs(settings.upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

@app.on_event("startup")
async def startup_event():
    await init_db()
    print("Database initialized")

@app.get("/")
async def root():
    return {"message": "FindChildd API", "status": "running"}

@app.post("/api/cases")
async def create_case(
    child_name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    last_seen_location: str = Form(...),
    description: str = Form(...),
    parent_name: str = Form(...),
    parent_phone: str = Form(...),
    parent_email: Optional[str] = Form(None),
    photo: UploadFile = File(...)
):
    """Create a new missing child case"""

    # Generate unique case ID
    case_id = f"MC{datetime.utcnow().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"

    # Save photo locally first
    file_extension = photo.filename.split(".")[-1]
    photo_filename = f"{case_id}.{file_extension}"
    photo_path = os.path.join(settings.upload_dir, photo_filename)

    with open(photo_path, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    # Upload to Cloudinary if configured (for WhatsApp image access)
    cloudinary_url = None
    if settings.cloudinary_cloud_name:
        try:
            # Use unsigned upload with default preset
            upload_result = cloudinary.uploader.unsigned_upload(
                photo_path,
                "ml_default",  # Default unsigned preset
                cloud_name=settings.cloudinary_cloud_name,
                folder="findchildd",
                public_id=f"findchildd_{case_id}"
            )
            cloudinary_url = upload_result['secure_url']
            print(f"[INFO] Image uploaded to Cloudinary: {cloudinary_url}")
        except Exception as e:
            print(f"[WARNING] Cloudinary upload failed: {e}")
            print("[INFO] Trying signed upload...")
            try:
                # Fallback to signed upload
                upload_result = cloudinary.uploader.upload(
                    photo_path,
                    public_id=f"findchildd/{case_id}",
                    folder="findchildd"
                )
                cloudinary_url = upload_result['secure_url']
                print(f"[INFO] Image uploaded to Cloudinary (signed): {cloudinary_url}")
            except Exception as e2:
                print(f"[ERROR] Both upload methods failed: {e2}")

    # Use Cloudinary URL for WhatsApp, local URL for frontend
    photo_url = f"/uploads/{photo_filename}"  # For frontend display
    whatsapp_photo_url = cloudinary_url  # For WhatsApp messages

    # Create case document
    case_data = {
        "case_id": case_id,
        "child_name": child_name,
        "age": age,
        "gender": gender,
        "last_seen_location": last_seen_location,
        "description": description,
        "photo_url": photo_url,
        "parent_name": parent_name,
        "parent_phone": parent_phone,
        "parent_email": parent_email,
        "status": CaseStatus.ACTIVE,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    await cases_collection.insert_one(case_data)

    # Generate AI alert message
    alert_message = await generate_missing_alert(case_data)

    # Get phone numbers from environment variable
    phone_numbers = []
    if settings.alert_phone_numbers:
        phone_numbers = [num.strip() for num in settings.alert_phone_numbers.split(",")]

    whatsapp_status = "not_attempted"
    whatsapp_error = None

    # Broadcast to WhatsApp numbers via selected provider
    if phone_numbers:
        try:
            # Use Cloudinary URL if available, otherwise try ngrok URL
            full_photo_url = whatsapp_photo_url  # Cloudinary URL (publicly accessible)

            if not full_photo_url and settings.public_base_url:
                # Fallback to ngrok/public URL if Cloudinary not configured
                full_photo_url = f"{settings.public_base_url}{photo_url}"
                print(f"[INFO] Using ngrok/public image URL: {full_photo_url}")
            elif full_photo_url:
                print(f"[INFO] Using Cloudinary image URL: {full_photo_url}")
            else:
                print("[WARNING] No image URL available - message will be sent without image")

            # Choose provider based on configuration
            if settings.whatsapp_provider == "waapi":
                results = await broadcast_to_groups_waapi(alert_message, full_photo_url, phone_numbers)
                print("[INFO] WhatsApp broadcast attempted via WaAPI")
            else:
                print("[WARNING] WhatsApp provider not configured properly")
                results = []

            # Check if any message was sent successfully
            if any(r.get("result", {}).get("status") == "sent" for r in results):
                whatsapp_status = "sent"
            elif any("error" in r.get("result", {}) for r in results):
                whatsapp_status = "failed"
                whatsapp_error = results[0].get("result", {}).get("error", "Unknown error")

        except Exception as e:
            # Don't fail the entire request if WhatsApp fails
            whatsapp_status = "failed"
            whatsapp_error = str(e)
            print(f"[WARNING] WhatsApp broadcast failed: {e}")
            print("[INFO] Case created successfully despite WhatsApp error")

    return {
        "success": True,
        "case_id": case_id,
        "message": "Case created successfully",
        "whatsapp_status": whatsapp_status,
        "whatsapp_error": whatsapp_error
    }

@app.get("/api/cases")
async def get_cases(status: Optional[str] = None):
    """Get all cases, optionally filtered by status"""
    query = {}
    if status:
        query["status"] = status

    cases = await cases_collection.find(query).sort("created_at", -1).to_list(100)

    # Convert ObjectId to string
    for case in cases:
        case["_id"] = str(case["_id"])

    return {"cases": cases}

@app.get("/api/cases/{case_id}")
async def get_case(case_id: str):
    """Get a specific case with responses"""
    case = await cases_collection.find_one({"case_id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    case["_id"] = str(case["_id"])

    # Get responses
    responses = await responses_collection.find({"case_id": case_id}).to_list(100)
    for resp in responses:
        resp["_id"] = str(resp["_id"])

    return {"case": case, "responses": responses}

@app.patch("/api/cases/{case_id}/status")
async def update_case_status(case_id: str, update: StatusUpdate):
    """Update case status"""
    if update.status not in [s.value for s in CaseStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")

    update_data = {
        "status": update.status,
        "updated_at": datetime.utcnow()
    }

    if update.status == CaseStatus.RESOLVED:
        update_data["resolved_at"] = datetime.utcnow()

    result = await cases_collection.update_one(
        {"case_id": case_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")

    # Notify WhatsApp groups if resolved
    if update.status == CaseStatus.RESOLVED:
        case = await cases_collection.find_one({"case_id": case_id})
        groups = await whatsapp_groups_collection.find({"is_active": True}).to_list(100)
        group_ids = [g["group_id"] for g in groups]

        resolution_message = f"GOOD NEWS!\n\n{case['child_name']} has been found safe!\n\nThank you to everyone who helped share and search."

        if group_ids:
            if settings.whatsapp_provider == "waapi":
                await broadcast_to_groups_waapi(resolution_message, None, group_ids)

    return {"success": True, "message": "Status updated"}

@app.post("/api/whatsapp/contacts")
async def add_whatsapp_contact(phone_number: str, contact_name: str):
    """Add a WhatsApp contact to broadcast list (must have opted into Twilio sandbox)"""
    contact_doc = {
        "phone_number": phone_number,
        "contact_name": contact_name,
        "is_active": True,
        "added_at": datetime.utcnow()
    }
    await whatsapp_groups_collection.insert_one(contact_doc)
    return {"success": True, "message": "Contact added"}

@app.get("/api/whatsapp/contacts")
async def get_whatsapp_contacts():
    """Get all WhatsApp contacts"""
    contacts = await whatsapp_groups_collection.find().to_list(100)
    for contact in contacts:
        contact["_id"] = str(contact["_id"])
    return {"contacts": contacts}

@app.get("/api/whatsapp/status")
async def get_whatsapp_status():
    """Get WhatsApp provider status"""
    if settings.whatsapp_provider == "waapi":
        status = await get_waapi_status()
        return {
            "provider": "waapi",
            "status": status
        }
    else:
        return {
            "provider": "unknown",
            "configured": False,
            "message": "WhatsApp provider not configured"
        }

@app.post("/api/whatsapp/webhook")
async def whatsapp_webhook(request: Request):
    """Webhook to receive incoming WhatsApp messages from WaAPI"""

    if settings.whatsapp_provider != "waapi":
        return {"status": "error", "message": "Only WaAPI webhooks are supported"}

    try:
        webhook_data = await request.json()
        result = await handle_incoming_message_waapi(webhook_data)
        return result
    except Exception as e:
        print(f"[ERROR] WaAPI webhook error: {e}")
        return {"status": "error", "error": str(e)}

@app.post("/api/contact")
async def submit_contact_form(
    name: str = Form(...),
    email: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...)
):
    """Handle contact form submissions"""
    contact_data = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
        "submitted_at": datetime.utcnow()
    }

    # Store in database (you can create a contacts collection)
    # For now, just log it
    print(f"Contact form submission from {name} ({email}): {subject}")
    print(f"Message: {message}")

    # TODO: Send email notification to admin
    # You can integrate with SendGrid, AWS SES, or other email service

    return {"success": True, "message": "Contact form submitted successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.backend_port, reload=True)
