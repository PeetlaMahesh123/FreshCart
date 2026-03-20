# Netlify Deployment Guide

## Step 1: Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select `PeetlaMahesh123/FreshCart` repository

## Step 2: Build Settings

Netlify will auto-detect:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

## Step 3: Environment Variables

In Site settings → Build & deploy → Environment:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://your-site-name.netlify.app
```

## Step 4: Deploy

Click "Deploy site" - Netlify will:
- Build and deploy your app
- Provide a random domain
- Set up SSL automatically
- Enable continuous deployment

## Step 5: Custom Domain

In Domain settings → Add custom domain:
- Add your domain name
- Netlify handles SSL automatically

## Netlify Benefits:
✅ Free SSL certificates
✅ Continuous deployment
✅ Form handling
✅ Edge functions
✅ Great for React apps
```

<arg_key>EmptyFile</arg_key>
<arg_value>false
