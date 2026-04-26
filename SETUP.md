# Setup Guide for FindChildd

## Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB (local or cloud)
- OpenAI API key
- WhatsApp Business API credentials (optional for testing)

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file:
```bash
cp .env.example .env
```

6. Edit `.env` and add your credentials:
```
MONGODB_URL=mongodb://localhost:27017/findchildd
OPENAI_API_KEY=sk-your-openai-key-here
WHATSAPP_API_KEY=your-whatsapp-key (optional)
WHATSAPP_PHONE_ID=your-phone-id (optional)
```

7. Start the backend server:
```bash
python main.py
```

Backend will run on http://localhost:8000

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## MongoDB Setup

### Option 1: Local MongoDB
Install MongoDB Community Edition from https://www.mongodb.com/try/download/community

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URL in backend/.env

## Getting API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create new secret key
5. Copy and paste into .env

### WhatsApp Business API (Optional)
1. Go to https://developers.facebook.com/
2. Create a Meta Business account
3. Set up WhatsApp Business API
4. Get API key and Phone ID
5. Add to .env

**Note:** Without WhatsApp API, the system will simulate sending messages (print to console).

## Testing the Application

1. Open http://localhost:3000
2. Click "Report Missing"
3. Fill out the form with test data
4. Submit and check backend console for WhatsApp simulation
5. View the case in "Active Cases"

## Adding WhatsApp Groups

Use the API to add WhatsApp groups:

```bash
curl -X POST http://localhost:8000/api/whatsapp/groups \
  -H "Content-Type: application/json" \
  -d '{"group_id": "1234567890@g.us", "group_name": "Community Alert Group"}'
```

## Production Deployment

### Backend
- Use Gunicorn or similar WSGI server
- Set up proper environment variables
- Use production MongoDB instance
- Enable HTTPS
- Set up proper CORS origins

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update NEXT_PUBLIC_API_URL to production backend URL

## Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in .env

**OpenAI API Error:**
- Verify API key is correct
- Check if you have credits in your OpenAI account

**WhatsApp Not Sending:**
- This is normal if you haven't set up WhatsApp Business API
- Messages will be simulated in console

**Frontend Can't Connect to Backend:**
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
