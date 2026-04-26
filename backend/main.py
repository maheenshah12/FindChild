from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from datetime import datetime
from typing import Optional
import uuid
import shutil

from config import settings
from database import init_db, cases_collection, responses_collection, whatsapp_groups_collection
from models import MissingChildCase, CaseStatus, Gender, StatusUpdate
from agent import generate_missing_alert
from whatsapp_twilio import broadcast_to_groups

app = FastAPI(title="FindChildd API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
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

    # Save photo
    file_extension = photo.filename.split(".")[-1]
    photo_filename = f"{case_id}.{file_extension}"
    photo_path = os.path.join(settings.upload_dir, photo_filename)

    with open(photo_path, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    photo_url = f"/uploads/{photo_filename}"

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

    # Broadcast to WhatsApp numbers via Twilio
    if phone_numbers:
        try:
            # For testing: send without image (localhost URLs don't work with Twilio)
            # full_photo_url = f"http://localhost:{settings.backend_port}{photo_url}"
            results = await broadcast_to_groups(alert_message, None, phone_numbers)
            print("[INFO] WhatsApp broadcast attempted")

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
            await broadcast_to_groups(resolution_message, None, group_ids)

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

@app.post("/api/whatsapp/webhook")
async def whatsapp_webhook(request: Request):
    """Webhook to receive incoming WhatsApp messages from Twilio"""
    from whatsapp_twilio import handle_incoming_message

    form_data = await request.form()
    from_number = form_data.get("From", "").replace("whatsapp:", "")
    message_body = form_data.get("Body", "")

    print(f"Received WhatsApp message from {from_number}: {message_body}")

    # TODO: Extract case_id from message context or database lookup
    # For now, just log the message

    return {"status": "received"}

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
