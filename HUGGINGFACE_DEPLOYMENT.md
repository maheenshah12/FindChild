# FindChildd - Hugging Face Spaces & Vercel Deployment Guide

## 🚀 Deployment Overview

- **Backend**: Hugging Face Spaces (Docker)
- **Frontend**: Vercel
- **Database**: MongoDB Atlas
- **Images**: Cloudinary
- **WhatsApp**: WaAPI

## 📋 Prerequisites

- Hugging Face account (https://huggingface.co)
- Vercel account (https://vercel.com)
- GitHub repository
- MongoDB Atlas account
- WaAPI account
- Cloudinary account
- Groq API key

---

## 🐳 Part 1: Deploy Backend to Hugging Face Spaces

### Step 1: Create a New Space

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Configure your Space:
   - **Space name**: `findchildd-backend` (or your preferred name)
   - **License**: Apache 2.0
   - **Select the Space SDK**: **Docker**
   - **Space hardware**: CPU basic (free tier)
   - **Visibility**: Public or Private

### Step 2: Prepare Backend Files

Your backend directory should contain:
- `Dockerfile` (already configured for port 7860)
- `main.py`
- `requirements.txt`
- All other backend Python files

**Important**: Hugging Face Spaces run on port **7860** by default. The backend is already configured for this.

### Step 3: Push Backend Code

```bash
# Clone your Space repository
git clone https://huggingface.co/spaces/YOUR_USERNAME/findchildd-backend
cd findchildd-backend

# Copy backend files
cp -r /path/to/FindChildd/backend/* .

# Commit and push
git add .
git commit -m "Initial backend deployment"
git push
```

### Step 4: Configure Secrets

In your Space settings, add these secrets:

```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/findchildd?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your_groq_api_key_here
WHATSAPP_PROVIDER=waapi
WAAPI_TOKEN=your_waapi_token
WAAPI_INSTANCE_URL=https://waapi.app/api/v1/instances/YOUR_INSTANCE_ID
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALERT_PHONE_NUMBERS=923001234567,923009876543
```

### Step 5: Wait for Build

- Hugging Face will automatically build your Docker container
- Check the build logs for any errors
- Once complete, your API will be available at: `https://YOUR_USERNAME-findchildd-backend.hf.space`

### Step 6: Test Backend

Visit these endpoints to verify:
- `https://YOUR_USERNAME-findchildd-backend.hf.space/` - Should return API status
- `https://YOUR_USERNAME-findchildd-backend.hf.space/docs` - FastAPI documentation
- `https://YOUR_USERNAME-findchildd-backend.hf.space/api/whatsapp/status` - WhatsApp status

---

## ▲ Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Repository

Make sure your GitHub repository has the frontend code in the `frontend/` directory.

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 3: Add Environment Variable

Add this environment variable in Vercel:

```
NEXT_PUBLIC_API_URL=https://YOUR_USERNAME-findchildd-backend.hf.space
```

**Important**: Replace with your actual Hugging Face Space URL (without trailing slash).

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Your site will be available at: `https://your-project.vercel.app`

### Step 5: Update CORS

After deployment, update `backend/main.py` to include your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-project.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app",
        "https://*.hf.space",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then push the update to Hugging Face Spaces:

```bash
cd findchildd-backend
git add main.py
git commit -m "Update CORS for Vercel deployment"
git push
```

---

## 🔧 Configuration Details

### MongoDB Atlas Setup

1. Create a cluster on MongoDB Atlas
2. Add IP whitelist: `0.0.0.0/0` (allow all IPs for Hugging Face Spaces)
3. Create database user with read/write permissions
4. Get connection string and add to Hugging Face secrets

### Cloudinary Setup

1. Sign up at https://cloudinary.com
2. Get credentials from dashboard
3. Add to Hugging Face secrets
4. Images will be automatically uploaded for WhatsApp delivery

### WaAPI Setup

1. Create instance at https://waapi.app
2. Get API token from Settings → API Token
3. Copy instance URL (format: `https://waapi.app/api/v1/instances/YOUR_ID`)
4. Add to Hugging Face secrets
5. Configure phone numbers in `ALERT_PHONE_NUMBERS` (format: `923001234567` without +)

---

## 🧪 Testing Your Deployment

### Backend Tests

```bash
# Test API health
curl https://YOUR_USERNAME-findchildd-backend.hf.space/

# Test WhatsApp status
curl https://YOUR_USERNAME-findchildd-backend.hf.space/api/whatsapp/status
```

### Frontend Tests

1. Visit your Vercel URL
2. Navigate to "Report Missing Child"
3. Fill out the form and upload an image
4. Submit and verify:
   - Case is created
   - Image uploads to Cloudinary
   - WhatsApp alert is sent

---

## 🐛 Troubleshooting

### Backend Issues

**Build fails on Hugging Face:**
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Check build logs in Space settings

**MongoDB connection fails:**
- Verify connection string format
- Check MongoDB Atlas IP whitelist (use 0.0.0.0/0)
- Ensure database user has correct permissions

**WhatsApp not working:**
- Verify WaAPI credentials in secrets
- Check WaAPI instance is active
- Verify phone number format (no + sign)

### Frontend Issues

**API calls fail:**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify CORS is configured in backend
- Check browser console for errors

**Build fails on Vercel:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check Vercel build logs

---

## 🔄 Updates and Redeployment

### Backend Updates

```bash
cd findchildd-backend
# Make your changes
git add .
git commit -m "Update description"
git push
```

Hugging Face will automatically rebuild and redeploy.

### Frontend Updates

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will automatically redeploy on push to main branch.

---

## 💰 Costs

- **Hugging Face Spaces**: Free (CPU basic tier)
- **Vercel**: Free (Hobby plan, 100GB bandwidth)
- **MongoDB Atlas**: Free (512MB storage)
- **Cloudinary**: Free (25 credits/month)
- **WaAPI Trial**: Free (10 actions per 5 minutes)
- **WaAPI Paid**: Starting at $9/month

---

## 🔒 Security Best Practices

✅ Never commit `.env` files  
✅ Use secrets/environment variables for all credentials  
✅ Keep MongoDB Atlas IP whitelist as restrictive as possible  
✅ Use HTTPS for all API calls  
✅ Regularly rotate API keys  
✅ Monitor usage and logs  

---

## 📚 Additional Resources

- [Hugging Face Spaces Documentation](https://huggingface.co/docs/hub/spaces)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [WaAPI Documentation](https://docs.waapi.app/)

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.
