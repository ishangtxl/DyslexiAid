# Vercel Deployment Guide for DyslexiAid

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (optional): `npm install -g vercel`

## Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push Your Code to GitHub
```bash
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

#### Step 2: Import Project to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your repository: `ishangtxl/DyslexiAid`
4. Configure the project:

**Framework Preset:** Other

**Root Directory:** `./` (leave as root)

**Build Settings:**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/build`
- Install Command: `npm install`

#### Step 3: Configure Environment Variables
In the Vercel dashboard, go to your project settings → Environment Variables and add:

**For Production:**
- `GEMINI_API_KEY`: `AIzaSyB4NLsW1nKztrFDAI6qtL3n1Py2vMflUb8`
- `ELEVENLABS_API_KEY`: `sk_7611984098ea783b04fe57af76d6616fa6b5dfdb2f1eedd3`
- `PORT`: `5001`

**Important:** Add these to all environments (Production, Preview, Development)

#### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
# From the project root
vercel

# For production deployment
vercel --prod
```

4. **Add Environment Variables** during setup or via CLI:
```bash
vercel env add GEMINI_API_KEY
vercel env add ELEVENLABS_API_KEY
vercel env add PORT
```

---

## Project Structure for Vercel

This project uses a monorepo structure:
- **Frontend**: React app in `/frontend` directory
- **Backend**: Express API in `/backend` directory

The `vercel.json` configuration handles routing:
- All `/api/*` requests → Backend (serverless functions)
- All other requests → Frontend (static site)

---

## Separate Deployment (Alternative)

If you prefer to deploy frontend and backend separately:

### Deploy Backend Only:
1. Create a new Vercel project
2. Set Root Directory to: `backend`
3. Framework Preset: Other
4. Build Command: (leave empty)
5. Output Directory: (leave empty)
6. Add environment variables
7. Deploy

### Deploy Frontend Only:
1. Create another Vercel project
2. Set Root Directory to: `frontend`
3. Framework Preset: Create React App
4. Add environment variable:
   - `REACT_APP_API_URL`: `<your-backend-vercel-url>`
5. Deploy

---

## Post-Deployment

### 1. Test Your Deployment
Visit your Vercel URL and test:
- Homepage loads correctly
- API endpoints work: `https://your-app.vercel.app/api/health`
- All features function properly

### 2. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

### 3. Enable CORS for Production
The backend is already configured to accept requests from all origins. If you need to restrict it:

Edit `backend/server.js` and update the CORS configuration:
```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### API Not Working
- Check that environment variables are set in Vercel
- Verify the `/api` routes are working: visit `/api/health`
- Check function logs in Vercel dashboard

### Frontend Can't Connect to Backend
- Ensure CORS is properly configured
- Check that API calls use the correct URL format
- Verify environment variables in frontend

---

## Monitoring

- **Deployments**: View all deployments in Vercel dashboard
- **Logs**: Check function logs for backend errors
- **Analytics**: Enable Vercel Analytics for insights

---

## Useful Commands

```bash
# View deployment logs
vercel logs <deployment-url>

# List all environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# Redeploy
vercel --prod
```

---

## Important Notes

1. **API Keys Security**: Never commit `.env` files. Environment variables are safely stored in Vercel.
2. **Serverless Functions**: Backend runs as serverless functions on Vercel.
3. **Cold Starts**: First request after inactivity may be slower (serverless limitation).
4. **Free Tier Limits**: Monitor your usage on Vercel's free tier.

---

## Support

For issues specific to Vercel deployment:
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
