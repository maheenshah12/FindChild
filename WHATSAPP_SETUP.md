# WhatsApp Integration Guide

## Overview

This project uses WhatsApp Business API to send missing child alerts to community groups. There are several ways to integrate WhatsApp:

## Option 1: WhatsApp Business API (Official - Recommended for Production)

### Requirements
- Meta Business Account
- WhatsApp Business API access
- Verified business

### Setup Steps

1. **Create Meta Business Account**
   - Go to https://business.facebook.com/
   - Create or log into your business account

2. **Set up WhatsApp Business API**
   - Go to https://developers.facebook.com/
   - Create a new app
   - Add WhatsApp product
   - Complete business verification

3. **Get Credentials**
   - Phone Number ID: Found in WhatsApp > API Setup
   - Access Token: Generate in App Settings > Basic

4. **Configure Webhook (for receiving messages)**
   ```python
   # Add to main.py
   @app.post("/api/whatsapp/webhook")
   async def whatsapp_webhook(request: Request):
       data = await request.json()
       # Handle incoming messages
       if data.get("entry"):
           for entry in data["entry"]:
               for change in entry.get("changes", []):
                   if change.get("value", {}).get("messages"):
                       for message in change["value"]["messages"]:
                           await handle_incoming_message(
                               message["from"],
                               message["text"]["body"],
                               # Extract case_id from context
                           )
       return {"status": "ok"}
   ```

5. **Update .env**
   ```
   WHATSAPP_API_KEY=your_access_token
   WHATSAPP_PHONE_ID=your_phone_number_id
   ```

## Option 2: Third-Party Services (Easier Setup)

### Twilio WhatsApp API

1. **Sign up at https://www.twilio.com/**
2. **Enable WhatsApp in Console**
3. **Get credentials:**
   - Account SID
   - Auth Token
   - WhatsApp-enabled phone number

4. **Update whatsapp.py:**
   ```python
   from twilio.rest import Client
   
   client = Client(account_sid, auth_token)
   
   async def send_whatsapp_message(phone_number: str, message: str, image_url: Optional[str] = None):
       try:
           message = client.messages.create(
               from_='whatsapp:+14155238886',  # Twilio sandbox or your number
               body=message,
               to=f'whatsapp:{phone_number}',
               media_url=[image_url] if image_url else None
           )
           return {"status": "sent", "sid": message.sid}
       except Exception as e:
           return {"error": str(e)}
   ```

### MessageBird

Similar setup to Twilio with their WhatsApp API.

## Option 3: Development/Testing (No API Required)

The current implementation includes a simulation mode that prints messages to console when WhatsApp API is not configured. This is perfect for:
- Local development
- Testing the flow
- Demo purposes

Messages will show in backend console like:
```
⚠️  WhatsApp API not configured. Message would be sent:
To: +1234567890
Message: 🚨 MISSING CHILD ALERT...
```

## WhatsApp Group IDs

### Getting Group IDs

**Method 1: WhatsApp Business API**
- Use the API to list groups your business account is part of
- Group IDs format: `1234567890@g.us`

**Method 2: Manual Entry**
- Admin adds groups through the API endpoint
- Store group IDs in database

### Adding Groups via API

```bash
curl -X POST http://localhost:8000/api/whatsapp/groups \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "1234567890@g.us",
    "group_name": "Community Safety Network"
  }'
```

### Managing Groups

```bash
# List all groups
curl http://localhost:8000/api/whatsapp/groups

# Deactivate a group (add this endpoint to main.py)
curl -X PATCH http://localhost:8000/api/whatsapp/groups/{group_id} \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

## Message Templates

WhatsApp Business API requires pre-approved message templates for initial outreach. You'll need to:

1. Create templates in Meta Business Manager
2. Get them approved
3. Use template names in API calls

Example template:
```
Name: missing_child_alert
Category: ALERT_UPDATE
Content: 
🚨 MISSING CHILD ALERT 🚨
Name: {{1}}
Age: {{2}}
Last Seen: {{3}}
Contact: {{4}}
```

## Receiving Responses

To handle incoming WhatsApp messages:

1. **Set up webhook URL** (must be HTTPS in production)
2. **Verify webhook** with Meta
3. **Process incoming messages** using the handler in whatsapp.py

## Best Practices

1. **Rate Limiting**: Don't spam groups. Space out messages.
2. **Opt-in**: Only send to groups that have opted in
3. **Privacy**: Protect parent contact information
4. **Updates**: Send resolution updates to same groups
5. **Compliance**: Follow WhatsApp Business Policy

## Testing Without WhatsApp API

For development, you can:
1. Use the built-in simulation mode
2. Test with a single phone number (your own)
3. Use Twilio sandbox for free testing

## Cost Considerations

- **WhatsApp Business API**: Pay per conversation
- **Twilio**: Pay per message
- **MessageBird**: Pay per message

For a non-profit project, consider applying for Meta's non-profit program for reduced rates.
