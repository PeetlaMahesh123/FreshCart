# Email Authentication Setup Guide

## 🚀 Overview
FreshCart now supports email verification for user registration. Users must verify their email address before they can login.

## 📧 Email Configuration

### Step 1: Supabase Dashboard Settings
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Under **Email Templates**, configure the confirmation email template
4. Enable **Enable email confirmations**

### Step 2: Site URL Configuration
1. In Supabase Dashboard → Authentication → **Settings**
2. Set **Site URL** to your deployed application URL:
   - **Development**: `http://localhost:5173`
   - **Production**: `https://your-domain.com`

### Step 3: Email Provider Options

#### Option A: Supabase Email Service (Recommended for Development)
1. In Supabase Dashboard → Authentication → **Settings**
2. Scroll to **Email Provider**
3. Select **Supabase Email Service**
4. Configure sender details

#### Option B: Custom SMTP (Recommended for Production)
1. In Supabase Dashboard → Authentication → **Settings**
2. Scroll to **Email Provider**
3. Select **Custom SMTP**
4. Configure SMTP settings:
   ```
   SMTP Host: smtp.gmail.com (for Gmail)
   SMTP Port: 587
   SMTP User: your-email@gmail.com
   SMTP Password: your-app-password
   ```
5. Enable **Enable custom SMTP**

## 🔧 Environment Variables

Create a `.env` file in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration (Optional)
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

## 📱 Authentication Flow

### Registration Process:
1. User fills registration form
2. Account created but **inactive**
3. Verification email sent to user
4. User clicks verification link
5. Account becomes **active**
6. User can now login

### Email Verification:
- Verification link redirects to `/auth/callback`
- Shows success/error message
- Auto-redirects to login page after 3 seconds

## 🎯 Testing Email Verification

### Development Testing:
1. Use services like [Mailtrap.io](https://mailtrap.io) for email testing
2. Or check browser console for verification links
3. Use temporary email services for testing

### Production Testing:
1. Use real email addresses
2. Check spam folders
3. Test the complete verification flow

## 🔒 Security Features

- Email verification required for account activation
- Secure password hashing
- Session management
- Protected routes
- Role-based access control

## 🌐 Deployment Considerations

### For Production:
1. Set correct **Site URL** in Supabase
2. Configure production SMTP settings
3. Enable HTTPS
4. Set up proper email templates
5. Monitor email deliverability

### Environment Variables:
- Never commit `.env` files
- Use secure key management
- Rotate keys regularly

## 📧 Email Template Customization

In Supabase Dashboard → Authentication → **Email Templates**:

**Confirmation Email Template:**
```html
<h2>Welcome to FreshCart!</h2>
<p>Thank you for registering. Please confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>This link expires in 24 hours.</p>
```

## 🚀 Quick Start

1. Configure Supabase email settings
2. Set up environment variables
3. Test registration flow
4. Verify email delivery
5. Deploy to production

## 📞 Support

For email authentication issues:
1. Check Supabase dashboard logs
2. Verify SMTP configuration
3. Check spam folders
4. Test with different email providers

Your FreshCart application now has secure email verification that works everywhere! 🎉
