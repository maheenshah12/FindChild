import httpx
from config import settings
from typing import List, Optional
from datetime import datetime
import re

def sanitize_message_for_windows(message: str) -> str:
    """
    Remove emojis and problematic Unicode characters that cause encoding issues on Windows.
    Keeps only ASCII and common Latin-1 characters.
    """
    # Remove emojis and other Unicode symbols (anything above ￿)
    # This regex removes characters in emoji ranges
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002702-\U000027B0"  # dingbats
        "\U000024C2-\U0001F251"
        "\U0001F900-\U0001F9FF"  # supplemental symbols
        "\U0001FA00-\U0001FA6F"  # extended symbols
        "]+",
        flags=re.UNICODE
    )

    # Remove emojis
    message = emoji_pattern.sub('', message)

    # Replace common problematic characters
    replacements = {
        '—': '-',  # em dash
        '–': '-',  # en dash
        ''': "'",  # smart quote
        ''': "'",  # smart quote
        '"': '"',  # smart quote
        '"': '"',  # smart quote
        '…': '...',  # ellipsis
    }

    for old, new in replacements.items():
        message = message.replace(old, new)

    # Keep only ASCII and basic Latin-1 characters (safe for Windows charmap)
    # This allows letters, numbers, punctuation, and basic accented characters
    message = ''.join(char for char in message if ord(char) < 256)

    return message.strip()

async def send_whatsapp_message_waapi(phone_number: str, message: str, image_url: Optional[str] = None):
    """
    Send WhatsApp message using WaAPI

    Args:
        phone_number: Recipient's WhatsApp number (format: 923001234567 or +923001234567)
        message: Text message to send
        image_url: Optional image URL to attach
    """
    if not settings.waapi_token or not settings.waapi_instance_url:
        print("[WARNING] WaAPI not configured. Message would be sent:")
        print(f"To: {phone_number}")
        print(f"Message: {message}")
        if image_url:
            print(f"Image: {image_url}")
        return {"status": "simulated", "message": "WaAPI not configured"}

    try:
        # Clean phone number (remove + and spaces)
        clean_number = phone_number.replace("+", "").replace(" ", "").replace("-", "")

        # WaAPI expects format: 923001234567@c.us
        if not clean_number.endswith("@c.us"):
            clean_number = f"{clean_number}@c.us"

        headers = {
            "Authorization": f"Bearer {settings.waapi_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            # Sanitize message to remove emojis and problematic Unicode characters
            sanitized_message = sanitize_message_for_windows(message)

            # Send text message first
            text_endpoint = f"{settings.waapi_instance_url}/client/action/send-message"
            text_payload = {
                "chatId": clean_number,
                "message": sanitized_message
            }

            text_response = await client.post(
                text_endpoint,
                json=text_payload,
                headers=headers
            )
            text_response.raise_for_status()
            text_result = text_response.json()

            print(f"[SUCCESS] WhatsApp text message sent via WaAPI!")
            print(f"   To: {phone_number}")

            # If image URL provided, send it as a separate message
            if image_url:
                import asyncio
                await asyncio.sleep(1)  # Small delay to ensure messages arrive in order

                media_endpoint = f"{settings.waapi_instance_url}/client/action/send-media"
                media_payload = {
                    "chatId": clean_number,
                    "mediaUrl": image_url
                }

                media_response = await client.post(
                    media_endpoint,
                    json=media_payload,
                    headers=headers
                )
                media_response.raise_for_status()
                media_result = media_response.json()

                print(f"[SUCCESS] WhatsApp image sent via WaAPI!")
                print(f"   Image URL: {image_url}")

                return {
                    "status": "sent",
                    "text_response": text_result,
                    "media_response": media_result,
                    "to": phone_number
                }

            return {
                "status": "sent",
                "response": text_result,
                "to": phone_number
            }

    except httpx.HTTPStatusError as e:
        error_msg = f"HTTP error: {e.response.status_code} - {e.response.text}"
        print(f"[ERROR] {error_msg}")
        return {"error": error_msg, "status": "failed"}

    except Exception as e:
        error_msg = f"Error sending WhatsApp message via WaAPI: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return {"error": error_msg, "status": "failed"}

async def broadcast_to_groups_waapi(message: str, image_url: Optional[str], phone_numbers: List[str]):
    """
    Broadcast message to multiple WhatsApp numbers using WaAPI

    Note: Trial instances have usage limits (10 actions per 5 minutes)

    Args:
        message: Alert message
        image_url: Optional image URL
        phone_numbers: List of WhatsApp numbers
    """
    results = []
    for phone_number in phone_numbers:
        result = await send_whatsapp_message_waapi(phone_number, message, image_url)
        results.append({"phone_number": phone_number, "result": result})
    return results

async def handle_incoming_message_waapi(webhook_data: dict):
    """
    Handle incoming WhatsApp messages from WaAPI webhook

    Args:
        webhook_data: Webhook payload from WaAPI
    """
    from database import responses_collection, cases_collection
    from agent import analyze_response

    try:
        # Extract message data from WaAPI webhook
        # Webhook structure may vary, adjust based on WaAPI documentation
        message_data = webhook_data.get("data", {})
        from_number = message_data.get("from", "").replace("@c.us", "")
        message_text = message_data.get("body", "")

        if not from_number or not message_text:
            return {"status": "ignored", "reason": "Missing required fields"}

        print(f"Received WhatsApp message from {from_number}: {message_text}")

        # Try to find related case (you might need to implement case matching logic)
        # For now, we'll store the message without case association

        # Analyze the response using AI
        analysis = await analyze_response(message_text)

        # Store response
        response_doc = {
            "responder_phone": from_number,
            "message": message_text,
            "analysis": analysis,
            "timestamp": datetime.utcnow(),
            "source": "waapi"
        }
        await responses_collection.insert_one(response_doc)

        return {"status": "processed", "analysis": analysis}

    except Exception as e:
        print(f"[ERROR] Error handling WaAPI webhook: {e}")
        return {"status": "error", "error": str(e)}

async def get_waapi_status():
    """
    Check WaAPI instance status
    """
    if not settings.waapi_token or not settings.waapi_instance_url:
        return {"status": "not_configured"}

    try:
        headers = {
            "Authorization": f"Bearer {settings.waapi_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            # Use the correct endpoint structure
            response = await client.get(
                f"{settings.waapi_instance_url}/client/me",
                headers=headers
            )
            response.raise_for_status()
            return response.json()

    except Exception as e:
        return {"status": "error", "error": str(e)}
