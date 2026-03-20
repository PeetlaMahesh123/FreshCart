# Vercel Deployment Guide (Recommended)

## Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `PeetlaMahesh123/FreshCart`

## Step 2: Configure Build Settings

Vercel will auto-detect:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 3: Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://your-vercel-domain.vercel.app
```

## Step 4: Deploy

Click "Deploy" - Vercel will:
- Build your application
- Deploy to global CDN
- Provide SSL certificate
- Give you a production URL

## Step 5: Custom Domain (Optional)

In Vercel Dashboard → Settings → Domains:
- Add your custom domain
- Vercel handles SSL automatically

## Benefits of Vercel:
✅ Free SSL certificate
✅ Global CDN
✅ Automatic deployments
✅ Custom domains
✅ Analytics
✅ Perfect for React apps
```

<arg_key>EmptyFile</arg_key>
<arg_value>false
