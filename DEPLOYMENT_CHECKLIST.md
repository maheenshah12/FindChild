# Deployment Checklist

## Pre-Deployment Cleanup ✓

- [x] Removed all test files
- [x] Removed Twilio integration code
- [x] Removed management/utility scripts
- [x] Cleaned up configuration files
- [x] Updated documentation
- [x] Removed Twilio from requirements.txt
- [x] Verified backend imports work

## Before Pushing to GitHub

### 1. Verify .gitignore
- [x] `.env` files are ignored
- [x] `uploads/` folder is ignored
- [x] `node_modules/` is ignored
- [x] `__pycache__/` is ignored

### 2. Check Sensitive Data
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No database credentials in code
- [ ] All secrets are in `.env` (which is gitignored)

### 3. Update Environment Variables
Make sure `.env.example` has all required variables without actual values:
- [x] MONGODB_URL
- [x] GROQ_API_KEY
- [x] WAAPI_TOKEN
- [x] WAAPI_INSTANCE_URL
- [x] CLOUDINARY credentials
- [x] ALERT_PHONE_NUMBERS

## GitHub Push Commands

```bash
# Check current status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Clean up codebase: Remove Twilio, add form validation, improve WhatsApp integration"

# Push to GitHub
git push origin main
```

## Deployment to Hugging Face Spaces & Vercel

See [HUGGINGFACE_DEPLOYMENT.md](./HUGGINGFACE_DEPLOYMENT.md) for detailed deployment instructions.

### Backend Environment Variables (Hugging Face Spaces)
Set these secrets in your Space settings:

```
MONGODB_URL=mongodb+srv://...
GROQ_API_KEY=gsk_...
WHATSAPP_PROVIDER=waapi
WAAPI_TOKEN=your_token
WAAPI_INSTANCE_URL=https://waapi.app/api/v1/instances/YOUR_ID
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALERT_PHONE_NUMBERS=923001234567,923009876543
```

### Frontend Environment Variables (Vercel)
```
NEXT_PUBLIC_API_URL=https://YOUR_USERNAME-findchildd-backend.hf.space
```

### CORS Configuration
Update `main.py` to include your deployed Vercel URL:
```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-project.vercel.app",  # Add your Vercel URL
    "https://*.vercel.app",
    "https://*.hf.space",
],
```

## Post-Deployment Testing

### 1. Test Backend API
- [ ] Visit `https://your-backend-url/docs`
- [ ] Check `/api/whatsapp/status` endpoint
- [ ] Verify Cloudinary connection

### 2. Test Frontend
- [ ] Homepage loads correctly
- [ ] Report form validation works
- [ ] Can create a new case
- [ ] Images upload to Cloudinary
- [ ] WhatsApp alerts are sent

### 3. Test WhatsApp Integration
- [ ] Create a test case
- [ ] Verify alert message received
- [ ] Verify image received
- [ ] Check both messages arrive

## WaAPI Upgrade (For Production)

If using trial instance, upgrade before going live:
1. Go to https://panel.waapi.app/
2. Upgrade your instance to paid plan
3. Add multiple recipient phone numbers
4. Update `ALERT_PHONE_NUMBERS` in environment variables

## Monitoring

After deployment, monitor:
- Backend logs for errors
- WhatsApp message delivery status
- Cloudinary usage
- MongoDB connection
- API response times

## Rollback Plan

If something goes wrong:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Roll back to previous commit if needed:
   ```bash
   git revert HEAD
   git push origin main
   ```

## Support Resources

- **WaAPI Docs**: https://docs.waapi.app/
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Next.js Docs**: https://nextjs.org/docs
