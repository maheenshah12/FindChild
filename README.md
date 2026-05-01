# FindChildd 🔍

**AI-Powered Child Safety Platform** - Connecting communities through technology to reunite families and bring missing children home safely.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Deployed on Hugging Face](https://img.shields.io/badge/🤗-Hugging%20Face-yellow)](https://huggingface.co/spaces)
[![Deployed on Vercel](https://img.shields.io/badge/▲-Vercel-black)](https://vercel.com)

## 🌟 Features

- **Instant Alert System** - AI-generated alerts distributed via WhatsApp within seconds
- **Community Network** - Connect volunteers and local communities for coordinated search efforts
- **Real-time Updates** - Track case status and receive community responses
- **Image Support** - Upload child photos with automatic cloud hosting via Cloudinary
- **Mobile-First Design** - Beautiful, responsive interface inspired by modern design principles
- **Secure & Private** - Password-protected admin functions and encrypted data storage

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, utility-first styling
- **Axios** - HTTP client for API requests

### Backend
- **FastAPI** - High-performance Python API
- **MongoDB Atlas** - Cloud database
- **Groq AI** - AI-powered alert generation
- **WaAPI** - WhatsApp messaging integration
- **Cloudinary** - Cloud image hosting

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- MongoDB Atlas account
- WaAPI account (for WhatsApp)
- Groq API key
- Cloudinary account (for image hosting)

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

# Create .env.local file
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

# WhatsApp Configuration (WaAPI)
WHATSAPP_PROVIDER=waapi
WAAPI_TOKEN=your_waapi_token
WAAPI_INSTANCE_URL=https://waapi.app/api/v1/instances/YOUR_INSTANCE_ID

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

BACKEND_PORT=8001
ALERT_PHONE_NUMBERS=923001234567,923009876543
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## 📱 WhatsApp Integration

### WaAPI Setup
1. Sign up at [WaAPI](https://waapi.app/)
2. Create a WhatsApp instance
3. Get your API token from Settings → API Token
4. Copy your instance URL (format: `https://waapi.app/api/v1/instances/YOUR_INSTANCE_ID`)
5. Add credentials to backend `.env` file
6. Configure alert recipient phone numbers (format: `923001234567` without + sign)

**Note:** Trial instances have limitations (10 actions per 5 minutes, limited recipients). Upgrade for production use.

For detailed setup instructions, see [WAAPI_SETUP.md](./WAAPI_SETUP.md)

## 🖼️ Image Hosting

Images are automatically uploaded to Cloudinary for reliable WhatsApp delivery:

1. Sign up at [Cloudinary](https://cloudinary.com/users/register_free)
2. Get your credentials from the dashboard
3. Add to backend `.env` file
4. Images will be automatically uploaded and accessible via public URLs

## 🚢 Deployment

### Backend - Hugging Face Spaces

The backend is deployed on Hugging Face Spaces, which provides free hosting for ML/AI applications:

1. Create a new Space on [Hugging Face](https://huggingface.co/spaces)
2. Select "Docker" as the SDK
3. Push your backend code with the Dockerfile
4. Configure secrets in Space settings:
   - `MONGODB_URL`
   - `GROQ_API_KEY`
   - `WAAPI_TOKEN`
   - `WAAPI_INSTANCE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `ALERT_PHONE_NUMBERS`
5. Space will automatically build and deploy

**Note:** Hugging Face Spaces run on port 7860 by default. The backend is configured to use this port.

### Frontend - Vercel

The frontend is deployed on Vercel for optimal Next.js performance:

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Select the `frontend` directory as the root
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your Hugging Face Space URL)
5. Deploy

**CORS Configuration:** Make sure to add your Vercel domain to the CORS allowed origins in `backend/main.py`

## 📁 Project Structure

```
FindChildd/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Data models
│   ├── agent.py             # AI alert generation
│   ├── whatsapp_waapi.py    # WhatsApp integration
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
│   │   └── hooks/                 # Custom React hooks
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
- Scroll-triggered animations

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
- [WaAPI](https://waapi.app/) - WhatsApp messaging
- [Groq](https://groq.com/) - AI processing
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Database hosting
- [Hugging Face Spaces](https://huggingface.co/spaces) - Backend hosting
- [Vercel](https://vercel.com/) - Frontend hosting

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ to help bring children home safely**
