# Fix Email Verification "Site Can't Be Reached" Error

## 🚨 Problem
Email verification links are pointing to `localhost:5173` instead of your production domain, causing "site can't be reached" errors when users click verification links on mobile.

## 🔧 Solution

### Step 1: Update Supabase Site URL

1. **Go to Supabase Dashboard** → **Authentication** → **Settings**
2. **Scroll to "Site URL" section**
3. **Update Site URL** to your production domain:
   ```
   https://your-domain.com
   ```
4. **Update Redirect URLs** to include:
   ```
   https://your-domain.com/**
   https://your-domain.com/auth/callback
   ```

### Step 2: Configure Environment Variables

Create or update your `.env` file:

```bash
# For Production
VITE_SITE_URL=https://your-domain.com/auth/callback

# For Development (optional)
VITE_SITE_URL=http://localhost:5173/auth/callback
```

### Step 3: Update Email Templates

In Supabase Dashboard → **Authentication** → **Email Templates**:

**Confirmation Template:**
```html
<h2>Welcome to FreshCart!</h2>
<p>Thank you for registering. Please confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>This link expires in 24 hours.</p>
<p>Having trouble? <a href="https://your-domain.com/auth/callback">Click here</a></p>
```

### Step 4: Test the Fix

1. **Register a new account** with your production domain
2. **Check your email** for verification link
3. **Click the link** - should now point to your domain
4. **Verify it works** on both desktop and mobile

## 🌐 Deployment Options

### Option A: Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option B: Deploy to Netlify
```bash
# Build the app
npm run build

# Deploy dist folder to Netlify
```

### Option C: Use ngrok for Testing (Temporary)
```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose localhost
ngrok http 5173
```

Then use the ngrok URL as your site URL.

## 📱 Mobile Testing

### Test on Real Mobile Devices:
1. **Deploy your app** to a real domain
2. **Register with mobile email** (Gmail, Outlook, etc.)
3. **Open email on mobile** and click verification link
4. **Should work perfectly** without "site can't be reached" error

### Test with Email Services:
- **Gmail** - Works on both mobile and desktop
- **Outlook** - Mobile app and web version
- **Yahoo Mail** - Mobile and desktop
- **Apple Mail** - iOS devices

## 🔍 Troubleshooting

### Still Getting Localhost Links?
1. **Clear browser cache** and cookies
2. **Check Supabase settings** - ensure site URL is updated
3. **Restart your app** after updating environment variables
4. **Create a new test account** to get fresh verification email

### Links Expired?
- Verification links expire in **24 hours**
- Request a new verification email if needed

### Mobile Browser Issues?
- Try **different mobile browsers** (Chrome, Safari, Firefox)
- Check **mobile network connectivity**
- Ensure **JavaScript is enabled** in mobile browser

## 🚀 Quick Fix Summary

1. **Update Supabase Site URL** to your production domain
2. **Set VITE_SITE_URL** environment variable
3. **Deploy your app** to a real domain
4. **Test email verification** on mobile device

## 📞 Support

If you still face issues:
1. **Check Supabase logs** for email delivery status
2. **Verify domain DNS** settings
3. **Test with different email providers**
4. **Check mobile browser console** for errors

Your FreshCart email verification will work perfectly on all devices once deployed to a real domain! 🎉
