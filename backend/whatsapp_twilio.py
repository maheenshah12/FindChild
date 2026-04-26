from twilio.rest import Client
from config import settings
from typing import List, Optional
from datetime import datetime

def get_twilio_client():
    """Initialize Twilio client"""
    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        return None
    return Client(settings.twilio_account_sid, settings.twilio_auth_token)

async def send_whatsapp_message(phone_number: str, message: str, image_url: Optional[str] = None):
    """
    Send WhatsApp message using Twilio

    Args:
        phone_number: Recipient's WhatsApp number (format: +923001234567)
        message: Text message to send
        image_url: Optional image URL to attach
    """
    client = get_twilio_client()

    if not client or not settings.twilio_whatsapp_number:
        print("[WARNING] Twilio WhatsApp not configured. Message would be sent:")
        print(f"To: {phone_number}")
        print(f"Message: {message}")
        if image_url:
            print(f"Image: {image_url}")
        return {"status": "simulated", "message": "Twilio not configured"}

    try:
        # Ensure phone number has whatsapp: prefix
        to_number = phone_number if phone_number.startswith('whatsapp:') else f'whatsapp:{phone_number}'
        from_number = settings.twilio_whatsapp_number if settings.twilio_whatsapp_number.startswith('whatsapp:') else f'whatsapp:{settings.twilio_whatsapp_number}'

        # Send message with optional image
        message_params = {
            'from_': from_number,
            'body': message,
            'to': to_number
        }

        if image_url:
            message_params['media_url'] = [image_url]

        twilio_message = client.messages.create(**message_params)

        print(f"[SUCCESS] WhatsApp message sent via Twilio!")
        print(f"   To: {phone_number}")
        print(f"   SID: {twilio_message.sid}")
        print(f"   Status: {twilio_message.status}")

        return {
            "status": "sent",
            "sid": twilio_message.sid,
            "to": phone_number
        }

    except Exception as e:
        print(f"[ERROR] Error sending WhatsApp message via Twilio: {e}")
        return {"error": str(e)}

async def broadcast_to_groups(message: str, image_url: Optional[str], phone_numbers: List[str]):
    """
    Broadcast message to multiple WhatsApp numbers

    Note: In Twilio sandbox, recipients must have opted in by sending 'join [code]'

    Args:
        message: Alert message
        image_url: Optional image URL
        phone_numbers: List of WhatsApp numbers (format: +923001234567)
    """
    results = []
    for phone_number in phone_numbers:
        result = await send_whatsapp_message(phone_number, message, image_url)
        results.append({"phone_number": phone_number, "result": result})
    return results

async def handle_incoming_message(from_number: str, message_text: str, case_id: str):
    """
    Handle incoming WhatsApp responses from Twilio webhook

    Args:
        from_number: Sender's WhatsApp number
        message_text: Message content
        case_id: Related case ID
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
