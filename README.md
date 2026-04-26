# FindChildd 🔍

**AI-Powered Child Safety Platform** - Connecting communities through technology to reunite families and bring missing children home safely.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)

## 🌟 Features

- **Instant Alert System** - AI-generated alerts distributed via WhatsApp within seconds
- **Community Network** - Connect volunteers and local communities for coordinated search efforts
- **Real-time Updates** - Track case status and receive community responses
- **Mobile-First Design** - Beautiful, responsive interface inspired by modern design principles
- **Secure & Private** - Password-protected admin functions and encrypted data storage

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, utility-first styling
- **Google Fonts** - Space Grotesk, Inter, Poppins

### Backend
- **FastAPI** - High-performance Python API
- **MongoDB Atlas** - Cloud database
- **Groq AI** - AI-powered alert generation
- **Twilio** - WhatsApp messaging integration

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- MongoDB Atlas account
- Twilio account (for WhatsApp)
- Groq API key

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/maheenshah12/FindChildd.git
cd FindChildd
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your credentials

# Start backend server
python main.py
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env.local file (copy from .env.example)
cp .env.example .env.local
# Edit .env.local with your API URL

# Start frontend server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGODB_URL=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=+14155238886
BACKEND_PORT=8001
ALERT_PHONE_NUMBERS=+1234567890,+0987654321
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## 📱 WhatsApp Integration

### Twilio Sandbox Setup
1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to WhatsApp Sandbox
3. Send "join [your-code]" to +1 415 523 8886 on WhatsApp
4. Add recipient numbers to `ALERT_PHONE_NUMBERS` in backend .env

**Note:** Twilio sandbox has a 5 messages/day limit. Upgrade to production for unlimited messages.

## 🚢 Deployment

### Deploy to Railway

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Create Railway project
3. Deploy backend and frontend as separate services
4. Set environment variables in Railway dashboard
5. Update CORS origins in backend

## 📁 Project Structure

```
FindChildd/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Data models
│   ├── agent.py             # AI alert generation
│   ├── whatsapp_twilio.py   # WhatsApp integration
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── layout.tsx         # Root layout
│   │   │   ├── cases/             # Cases pages
│   │   │   ├── report/            # Report form
│   │   │   └── contact/           # Contact page
│   │   └── components/            # Reusable components
│   ├── package.json         # Node dependencies
│   └── .env.example         # Environment template
└── README.md
```

## 🎨 Design

The UI is inspired by modern design principles with:
- Clean, minimal aesthetic
- Violet/purple color scheme (#7c3aed)
- Rounded corners and smooth animations
- Floating navigation header
- Responsive mobile-first design

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Important Notice

**Always contact local police immediately when a child goes missing.** This platform is a supplementary tool to help spread awareness through community networks.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [Twilio](https://www.twilio.com/) - WhatsApp messaging
- [Groq](https://groq.com/) - AI processing
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Database hosting
- [Railway](https://railway.app/) - Deployment platform

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ to help bring children home safely**
