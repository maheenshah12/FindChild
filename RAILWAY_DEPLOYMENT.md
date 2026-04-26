# FindChildd - Railway Deployment Guide

## 🚀 Deploy to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository
- MongoDB Atlas account
- Twilio account

### Step 1: Prepare Your Repository

**IMPORTANT: Before pushing to GitHub:**

1. Make sure `.env` is in `.gitignore` (already done)
2. Never commit real credentials
3. Use `.env.example` as a template

### Step 2: Deploy Backend (FastAPI)

1. Go to Railway dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python/FastAPI
5. Set **Root Directory**: `backend`

**Environment Variables to Set in Railway:**
```
MONGODB_URL=mongodb+srv://...
GROQ_API_KEY=gsk_your_groq_api_key_here
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+14155238886
BACKEND_PORT=8001
UPLOAD_DIR=./uploads
ALERT_PHONE_NUMBERS=+923341373288
```

6. Railway will automatically:
   - Install dependencies from `requirements.txt`
   - Run the app
   - Assign a public URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend (Next.js)

1. Create another Railway service
2. Select same GitHub repo
3. Set **Root Directory**: `frontend`
4. Railway auto-detects Next.js

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Step 4: Update CORS

After deployment, update `backend/main.py` CORS to include your Railway frontend URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-frontend.railway.app"  # Add this
    ],
    ...
)
```

### Step 5: Test WhatsApp Alerts

- Twilio sandbox works the same on Railway
- Daily limit still applies (5 messages/day)
- Resets at midnight UTC
- Recipients must join sandbox first

## 🔒 Security Checklist

✅ `.env` is in `.gitignore`  
✅ Phone numbers moved to environment variables  
✅ No hardcoded credentials in code  
✅ Use Railway's environment variables dashboard  
✅ Never commit `.env` file  

## 📱 Adding More Phone Numbers

In Railway environment variables:
```
ALERT_PHONE_NUMBERS=+923341373288,+923001234567,+923009876543
```

Separate multiple numbers with commas (no spaces).

## 🐛 Troubleshooting

**WhatsApp not working:**
- Check Twilio credentials in Railway env vars
- Verify recipients joined sandbox
- Check daily limit (5 messages)

**CORS errors:**
- Add Railway frontend URL to CORS origins
- Redeploy backend after changes

**Database connection:**
- Verify MongoDB Atlas allows Railway IPs
- Check connection string format

## 💰 Costs

- **Railway**: $5/month (Hobby plan) or free tier
- **MongoDB Atlas**: Free tier (512MB)
- **Twilio Sandbox**: Free (5 messages/day)
- **Twilio Production**: ~$0.005 per message

## 🔄 Updates

Push to GitHub → Railway auto-deploys → Live in ~2 minutes
