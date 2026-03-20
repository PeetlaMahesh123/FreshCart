# GitHub Pages Deployment with Environment Variables

## 🚀 Complete GitHub Deployment Setup

### Step 1: Add Environment Variables to GitHub

1. **Go to your GitHub repository**: https://github.com/PeetlaMahesh123/FreshCart
2. **Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Add these secrets**:

#### Required Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://peetlamahesh123.github.io/FreshCart
```

### Step 2: Enable GitHub Pages

1. **Settings** → **Pages**
2. **Source**: GitHub Actions
3. **Save**

### Step 3: Push Your Changes

The GitHub Actions workflow will automatically:
- Build your application
- Deploy to GitHub Pages
- Use environment variables from secrets

### Step 4: Access Your Live Site

Your FreshCart will be available at:
**https://peetlamahesh123.github.io/FreshCart/**

## 📋 What Happens Automatically:

✅ **Every push to main** triggers deployment
✅ **Environment variables** are securely loaded
✅ **Build optimization** for production
✅ **SSL certificate** automatically provided
✅ **Global CDN** through GitHub Pages

## 🔧 Environment Variables Details:

### VITE_SUPABASE_URL
Get from Supabase Dashboard → Settings → API

### VITE_SUPABASE_ANON_KEY
Get from Supabase Dashboard → Settings → API

### VITE_SITE_URL
Your GitHub Pages URL: `https://peetlamahesh123.github.io/FreshCart`

## 🌟 Benefits:

✅ **Free hosting** through GitHub Pages
✅ **Automatic deployments** on every push
✅ **Secure environment variables** through GitHub Secrets
✅ **SSL certificate** included
✅ **Custom domain** support available
✅ **Version control** with deployment history

## 🚨 Important Notes:

- Environment variables are stored securely in GitHub Secrets
- Build process uses these variables during deployment
- Your site automatically updates when you push changes
- All features work including admin panel and e-commerce

## 🎯 After Deployment:

1. **Visit your site**: https://peetlamahesh123.github.io/FreshCart/
2. **Test all features**: Registration, admin panel, product management
3. **Verify email verification** works with the new URL
4. **Test payment integration** with Razorpay

Your FreshCart e-commerce platform will be live and fully functional! 🛒✨
```
