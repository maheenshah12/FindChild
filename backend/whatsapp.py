import httpx
from config import settings
from typing import List, Optional
from datetime import datetime

async def send_whatsapp_message(phone_number: str, message: str, image_url: Optional[str] = None):
    """
    Send WhatsApp message using WhatsApp Business API
    """
    if not settings.whatsapp_api_key or not settings.whatsapp_phone_id:
        print("⚠️  WhatsApp API not configured. Message would be sent:")
        print(f"To: {phone_number}")
        print(f"Message: {message}")
        return {"status": "simulated", "message": "WhatsApp API not configured"}

    url = f"{settings.whatsapp_api_url}/{settings.whatsapp_phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {settings.whatsapp_api_key}",
        "Content-Type": "application/json"
    }

    # Send image if provided
    if image_url:
        payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "image",
            "image": {
                "link": image_url,
                "caption": message
            }
        }
    else:
        payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "text",
            "text": {"body": message}
        }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error sending WhatsApp message: {e}")
            return {"error": str(e)}

async def broadcast_to_groups(message: str, image_url: Optional[str], group_ids: List[str]):
    """
    Broadcast message to multiple WhatsApp groups
    """
    results = []
    for group_id in group_ids:
        result = await send_whatsapp_message(group_id, message, image_url)
        results.append({"group_id": group_id, "result": result})
    return results

async def handle_incoming_message(from_number: str, message_text: str, case_id: str):
    """
    Handle incoming WhatsApp responses
    """
    from database import responses_collection, cases_collection
    from agent import analyze_response

    # Analyze the response using AI
    analysis = await analyze_response(message_text)

    # Store response
    response_doc = {
        "case_id": case_id,
        "responder_phone": from_number,
        "message": message_text,
        "analysis": analysis,
        "timestamp": datetime.utcnow()
    }
    await responses_collection.insert_one(response_doc)

    # If credible, forward to parent
    if analysis.get("is_credible"):
        case = await cases_collection.find_one({"case_id": case_id})
        if case:
            forward_message = f"📩 New lead for {case['child_name']}:\n\n{message_text}\n\nFrom: {from_number}"
            await send_whatsapp_message(case["parent_phone"], forward_message)

    return analysis
