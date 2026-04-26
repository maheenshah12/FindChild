# Quick Start Guide - FindChildd Platform

## What We've Built

✅ **Backend (Python FastAPI)**
- Missing child case management
- AI-powered alert generation (Groq)
- Twilio WhatsApp integration
- MongoDB database
- Image upload handling

✅ **Frontend (Next.js)**
- Home page
- Report missing child form
- Active/resolved cases listing
- Case detail pages

---

## Prerequisites Checklist

Before running, make sure you have:

- [ ] Python 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account created
- [ ] Groq API key (get one from https://console.groq.com/)
- [ ] Twilio account (optional for testing)

---

## Setup Steps

### 1. Install Backend Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Your `.env` file is already set up with:
- ✅ MongoDB connection
- ✅ Groq API key
- ⚠️ Twilio (needs your credentials)

**If you have Twilio credentials**, update in `backend\.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**If you don't have Twilio yet**, that's fine! The system will simulate WhatsApp messages in the console.

### 3. Start Backend Server

```bash
cd backend
venv\Scripts\activate
python main.py
```

You should see:
```
✅ Database initialized
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 4. Install Frontend Dependencies

Open a **NEW terminal** (keep backend running):

```bash
cd frontend
npm install
```

### 5. Configure Frontend

Create `frontend\.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 6. Start Frontend Server

```bash
cd frontend
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
```

### 7. Open in Browser

Go to: **http://localhost:3000**

---

## Testing the Platform

### Test 1: View Home Page
- Open http://localhost:3000
- You should see the FindChildd homepage

### Test 2: Submit a Missing Child Report
1. Click **"Report Missing"**
2. Fill out the form:
   - Child's name: "Test Child"
   - Age: 10
   - Gender: Male
   - Last seen: "Central Park"
   - Description: "Wearing blue shirt"
   - Upload any photo
   - Parent name: Your name
   - Phone: Your phone number (format: +923001234567)
3. Click **"Submit Report & Send Alert"**

### Test 3: Check Backend Console
After submitting, check your backend terminal. You should see:
```
⚠️  Twilio WhatsApp not configured. Message would be sent:
To: +923001234567
Message: 🚨 MISSING CHILD ALERT 🚨
...
```

This means the AI generated the alert! (It's simulated because Twilio isn't configured yet)

### Test 4: View Cases
1. Go to http://localhost:3000/cases
2. You should see your test case listed
3. Click on it to see details

---

## What Works Right Now (Without Twilio)

✅ Submit missing child reports
✅ AI generates alert messages (using Groq)
✅ Store cases in MongoDB
✅ View active/resolved cases
✅ Upload and display photos
✅ Update case status
✅ See alert messages in console (simulated)

---

## What Needs Twilio to Work

❌ Actually send WhatsApp messages
❌ Receive responses from community
❌ Forward tips to parents

---

## Next Steps

### Option A: Test Without WhatsApp (Recommended First)
1. Run the commands above
2. Submit test cases
3. See how the system works
4. Check AI-generated alerts in console

### Option B: Set Up Twilio WhatsApp
1. Follow `TWILIO_SETUP.md`
2. Create Twilio account
3. Get credentials
4. Update `.env` file
5. Test real WhatsApp messages

### Option C: Add Telegram Bot (Free Alternative)
- Want me to add Telegram integration?
- 100% free, no limitations
- Takes 10 minutes

---

## Common Issues

### "Module not found" error
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### "Connection refused" on frontend
- Make sure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend\.env.local

### "MongoDB connection error"
- Verify your MongoDB connection string in backend\.env
- Check if your IP is whitelisted in MongoDB Atlas

### "Groq API error"
- Verify your Groq API key is correct
- Check if you have credits remaining

---

## Project Structure

```
FindChildd/
├── backend/
│   ├── main.py              # API server
│   ├── agent.py             # AI (Groq) integration
│   ├── whatsapp_twilio.py   # Twilio WhatsApp
│   ├── database.py          # MongoDB
│   ├── config.py            # Settings
│   ├── models.py            # Data models
│   ├── .env                 # Your credentials
│   └── requirements.txt     # Python packages
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx         # Home page
│   │   ├── report/          # Report form
│   │   └── cases/           # Cases listing
│   ├── package.json         # Node packages
│   └── .env.local           # Frontend config
├── README.md
├── SETUP.md
├── TWILIO_SETUP.md
└── QUICKSTART.md (this file)
```

---

## Ready to Start?

Run these commands in order:

**Terminal 1 (Backend):**
```bash
cd C:\FindChildd\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd C:\FindChildd\frontend
npm install
npm run dev
```

**Browser:**
```
http://localhost:3000
```

---

## Need Help?

- Backend not starting? Check Python version: `python --version`
- Frontend not starting? Check Node version: `node --version`
- Database errors? Verify MongoDB connection string
- WhatsApp not working? That's normal without Twilio - it will simulate

**Want me to run these commands for you?** Just say "start the project" and I'll do it!
