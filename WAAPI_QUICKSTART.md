# WaAPI Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Get Your WaAPI Credentials

From your screenshot, you have a trial instance. You need:

1. **API Token**: Go to Settings → API Token in WaAPI panel
2. **Instance ID**: Found in your instance URL

### 2. Update Your .env File

Open `backend/.env` and add:

```env
# Switch to WaAPI
WHATSAPP_PROVIDER=waapi

# Your WaAPI credentials
WAAPI_TOKEN=your_token_from_waapi_panel
WAAPI_INSTANCE_URL=https://waapi.app/api/v1/instances/YOUR_INSTANCE_ID

# Phone numbers to receive alerts (no + sign)
ALERT_PHONE_NUMBERS=923002628842
```

### 3. Test the Integration

```bash
cd backend
python test_waapi.py
```

This will:
- Check your configuration
- Verify instance status
- Send a test message

### 4. Start Your Application

```bash
cd backend
python main.py
```

Now when you create a missing child case, alerts will be sent via WaAPI!

## 📱 Phone Number Format

**Important**: WaAPI uses numbers WITHOUT the + sign

- ✅ Correct: `923002628842`
- ❌ Wrong: `+923002628842`

## ⚠️ Trial Instance Limitations

Your trial instance (from screenshot):
- Expires in 3 days
- Limited to your trial number: `923002628842@c.us`
- 10 actions per 5 minutes
- Cannot create API instances

## 🔄 How It Works

1. User reports missing child via frontend
2. Backend creates case in MongoDB
3. AI generates alert message (using Groq)
4. WaAPI sends WhatsApp messages to configured numbers
5. Recipients receive alert with child details

## 🧪 Testing

1. Run test script: `python test_waapi.py`
2. Or create a case through the frontend
3. Check console logs for sending status
4. Verify message received on WhatsApp

## 📊 Check Status

```bash
curl http://localhost:8001/api/whatsapp/status
```

## 🆘 Troubleshooting

**"WaAPI not configured"**
- Check .env file has WAAPI_TOKEN and WAAPI_INSTANCE_URL

**"HTTP error: 401"**
- Invalid API token, get new one from panel

**"HTTP error: 404"**
- Wrong instance URL, check your instance ID

**"Instance expired"**
- Trial expired, create new trial or upgrade

**Messages not sending**
- Check trial usage limits (10 per 5 min)
- Verify phone number format (no + sign)
- Ensure instance is active in panel

## 🔐 Security Note

Never commit your `.env` file! It contains sensitive credentials.

## 📚 Full Documentation

See `WAAPI_SETUP.md` for complete documentation.
