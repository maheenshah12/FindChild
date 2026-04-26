# Twilio WhatsApp Setup Guide

## Overview
This guide will help you set up Twilio WhatsApp integration for sending missing child alerts.

---

## Step 1: Create Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Click **"Sign up"**
3. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password
4. Click **"Start your free trial"**
5. **Verify your email** (check inbox)
6. **Verify your phone number** (they'll send SMS code)

You'll get **$15-20 free credits** to test!

---

## Step 2: Get Your Credentials

After login, you'll see the **Twilio Console Dashboard**:

1. Look for the **"Account Info"** section (usually on the right side)
2. You'll see:
   - **Account SID**: Starts with `AC...` (e.g., `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token**: Click the eye icon to reveal it

**Copy both** - you'll need them!

---

## Step 3: Set Up WhatsApp Sandbox (FREE)

### What is Sandbox?
- Free testing environment
- Recipients must opt-in first
- Perfect for development and small groups

### Setup Steps:

1. In Twilio Console, click **"Messaging"** in left sidebar
2. Click **"Try it out"** → **"Send a WhatsApp message"**
3. You'll see the **WhatsApp Sandbox** page with:
   - **Sandbox Number**: e.g., `+1 415 523 8886`
   - **Join Code**: e.g., `join happy-elephant`

### Connect Your Phone:

1. **Open WhatsApp** on your phone
2. **Start a new chat** with the sandbox number: `+1 415 523 8886`
3. **Send this exact message**: `join happy-elephant` (use YOUR join code)
4. You'll receive: **"Sandbox: ✅ You are all set!"**

✅ Your phone is now connected!

---

## Step 4: Update Your .env File

Open `C:\FindChildd\backend\.env` and update:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

Replace with YOUR actual values from Twilio Console.

---

## Step 5: Add Recipients to Your System

Recipients must:
1. **Opt-in to sandbox** (send "join code" to Twilio number)
2. **Be added to your database**

### Add via API:

```bash
curl -X POST http://localhost:8000/api/whatsapp/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+923001234567",
    "contact_name": "Community Volunteer"
  }'
```

### Add Multiple Contacts:

```bash
# Contact 1
curl -X POST http://localhost:8000/api/whatsapp/contacts \
  -d "phone_number=+923001234567&contact_name=Volunteer 1"

# Contact 2
curl -X POST http://localhost:8000/api/whatsapp/contacts \
  -d "phone_number=+923009876543&contact_name=Volunteer 2"
```

**Important**: Phone numbers must be in international format: `+[country code][number]`
- Pakistan: `+923001234567`
- India: `+919876543210`
- USA: `+14155551234`

---

## Step 6: Test the System

### Test 1: Send Manual Message

Create a test file `test_whatsapp.py`:

```python
from twilio.rest import Client

account_sid = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
auth_token = "your_auth_token"
client = Client(account_sid, auth_token)

message = client.messages.create(
    from_='whatsapp:+14155238886',
    body='🚨 TEST: This is a test alert from FindChildd!',
    to='whatsapp:+923001234567'  # Your phone number
)

print(f"Message sent! SID: {message.sid}")
```

Run: `python test_whatsapp.py`

### Test 2: Submit Missing Child Report

1. Start your backend: `python main.py`
2. Start your frontend: `npm run dev`
3. Go to http://localhost:3000/report
4. Fill out the form and submit
5. Check your WhatsApp - you should receive the alert!

---

## Step 7: Set Up Webhook (For Receiving Replies)

When people reply to alerts, Twilio needs to send those messages to your backend.

### In Twilio Console:

1. Go to **Messaging** → **Settings** → **WhatsApp Sandbox Settings**
2. Find **"When a message comes in"**
3. Enter your webhook URL: `https://your-domain.com/api/whatsapp/webhook`

**For local testing**, use **ngrok**:

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 8000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use: https://abc123.ngrok.io/api/whatsapp/webhook
```

---

## Sandbox Limitations

### ❌ What You CAN'T Do:
- Send to people who haven't opted in
- Send to WhatsApp groups directly
- Use for production without approval

### ✅ What You CAN Do:
- Send to anyone who opted in (sent join code)
- Test all features for free
- Receive replies
- Send images and text

---

## Upgrading to Production

When ready for real use:

1. **Apply for WhatsApp Business API** in Twilio Console
2. **Business Verification** (submit documents)
3. **Approval** (takes 1-2 weeks)
4. **Cost**: ~$0.005 per message

### Production Benefits:
- No opt-in required
- Send to anyone
- Professional sender name
- Higher rate limits

---

## Troubleshooting

### "Message not sent"
- ✅ Check recipient opted into sandbox
- ✅ Verify phone number format (+country code)
- ✅ Check Twilio credentials in .env

### "Authentication failed"
- ✅ Verify Account SID and Auth Token
- ✅ Check for extra spaces in .env file

### "Recipient not opted in"
- ✅ Recipient must send "join code" first
- ✅ Check they used correct sandbox number

### "No credits"
- ✅ Check Twilio Console → Billing
- ✅ Add payment method if trial expired

---

## Cost Estimate

**Sandbox (Testing)**: FREE forever
**Production**:
- 100 alerts = $0.50
- 1,000 alerts = $5.00
- 10,000 alerts = $50.00

Very affordable for a social cause!

---

## Alternative: Telegram (Still Recommended)

If Twilio costs are a concern, consider **Telegram Bot**:
- ✅ 100% FREE forever
- ✅ No opt-in required
- ✅ No limitations
- ❌ Different app (not WhatsApp)

Want me to add Telegram as well? You can use BOTH!

---

## Next Steps

1. ✅ Create Twilio account
2. ✅ Get credentials (SID, Token)
3. ✅ Set up sandbox
4. ✅ Update .env file
5. ✅ Opt-in your phone
6. ✅ Test sending message
7. ✅ Add contacts to database
8. ✅ Submit test case

**Ready to test?** Follow the steps above and let me know if you get stuck!
