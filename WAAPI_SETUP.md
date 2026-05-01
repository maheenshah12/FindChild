# WaAPI Integration Setup Guide

This guide will help you integrate WaAPI (WhatsApp API) into your FindChildd application.

## Prerequisites

1. A WaAPI account (sign up at https://panel.waapi.app/)
2. An active WhatsApp number for your instance

## Step 1: Create WaAPI Instance

1. Go to https://panel.waapi.app/
2. Click on "Create Trial Instance" (or use an existing instance)
3. Note down your trial phone number (e.g., `923002628842@c.us`)
4. Your instance will expire in 3 days (trial), upgrade to paid plan for continued access

## Step 2: Get Your API Token

1. In the WaAPI panel, go to **Settings** → **API Token**
2. Copy your API token
3. Note your instance URL format: `https://waapi.app/api/v1/instances/YOUR_INSTANCE_ID`

## Step 3: Configure Your Backend

1. Open `backend/.env` file
2. Add the following configuration:

```env
# WhatsApp Provider Selection
WHATSAPP_PROVIDER=waapi

# WaAPI Configuration
WAAPI_TOKEN=your_actual_token_here
WAAPI_INSTANCE_URL=https://waapi.app/api/v1/instances/YOUR_INSTANCE_ID

# Alert Recipients (phone numbers without + sign)
ALERT_PHONE_NUMBERS=923001234567,923009876543
```

## Step 4: Phone Number Format

WaAPI uses a specific phone number format:
- **Input format**: `923001234567` (country code + number, no + sign)
- **Internal format**: `923001234567@c.us` (automatically added by the code)

Example:
- Pakistan: `923001234567`
- USA: `14155551234`
- UK: `447700900123`

## Step 5: Set Up Webhook (Optional)

To receive incoming WhatsApp messages:

1. In WaAPI panel, go to **Webhook Settings**
2. Set webhook URL to: `https://your-backend-url.com/api/whatsapp/webhook`
3. Enable webhook for message events

## Step 6: Test the Integration

1. Start your backend server:
```bash
cd backend
python main.py
```

2. Create a test case through your frontend
3. Check the console logs for WhatsApp sending status

## API Endpoints

### Check WaAPI Status
```bash
GET /api/whatsapp/status
```

Returns the current status of your WaAPI instance.

### Webhook Endpoint
```bash
POST /api/whatsapp/webhook
```

Receives incoming WhatsApp messages from WaAPI.

## Trial Instance Limitations

- **Expires in 3 days** - Create a new trial or upgrade to paid
- **API creation not available** for trial instances
- **Limited to interactions** with your designated trial number only
- **Usage cap**: 10 actions or requests every 5 minutes

## Switching Between Providers

You can switch between Twilio and WaAPI by changing the `WHATSAPP_PROVIDER` setting:

```env
# Use WaAPI
WHATSAPP_PROVIDER=waapi

# Or use Twilio
WHATSAPP_PROVIDER=twilio
```

## Troubleshooting

### Messages not sending
- Verify your API token is correct
- Check that your instance is active (not expired)
- Ensure phone numbers are in correct format (no + sign)
- Check trial instance usage limits

### Webhook not receiving messages
- Verify webhook URL is publicly accessible
- Check that webhook is enabled in WaAPI panel
- Ensure your backend is running and accessible

### Instance expired
- Create a new trial instance
- Or upgrade to a paid plan for permanent access

## WaAPI vs Twilio Comparison

| Feature | WaAPI | Twilio |
|---------|-------|--------|
| Setup Complexity | Easy | Medium |
| Trial Available | Yes (3 days) | Yes (with sandbox) |
| Phone Number | Provided | Need to opt-in |
| Image Support | Yes | Yes |
| Webhook Support | Yes | Yes |
| Pricing | Pay per message | Pay per message |

## Support

- WaAPI Documentation: https://docs.waapi.app/
- WaAPI Support: Available in the panel
- FindChildd Issues: Create an issue in the repository
