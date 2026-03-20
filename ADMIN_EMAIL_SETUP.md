# 🚀 Admin Setup with Email Verification Guide

## ✅ **Current Status: Fixed**
- ✅ Role selection working (Admin/Customer)
- ✅ Email verification enabled
- ✅ Proper profile creation with correct role
- ✅ Admin access after email verification

## 📧 **Step 1: Configure Supabase Email**

### **Option A: Use Supabase Email Service (Easiest)**
1. **Go to Supabase Dashboard** → **Authentication** → **Settings**
2. **Scroll to "Email Provider"**
3. **Select "Supabase Email Service"**
4. **Configure sender details**:
   ```
   Sender Name: FreshCart
   Sender Email: noreply@your-domain.com
   ```

### **Option B: Use Gmail SMTP (Free)**
1. **Select "Custom SMTP"**
2. **Configure Gmail settings**:
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: your-gmail@gmail.com
   SMTP Password: your-app-password
   ```
3. **Enable "Enable custom SMTP"**

### **Step 3: Enable Email Confirmation**
1. **Check "Enable email confirmations"**
2. **Set Site URL**: `http://localhost:5174`
3. **Add Redirect URLs**: `http://localhost:5174/**`

## 🎯 **Step 2: Create Admin Account**

### **Register as Admin:**
1. **Open**: `http://localhost:5174/`
2. **Click "Register"**
3. **Select "Admin"** account type
4. **Fill details**:
   ```
   Full Name: FreshCart Admin
   Email: admin@freshcart.local
   Phone: 9876543210
   Password: admin123
   Confirm Password: admin123
   ```
5. **Click "Create Account"**

### **Check Email:**
1. **Check your email inbox** (including spam folder)
2. **Look for "FreshCart - Confirm your email"**
3. **Click the verification link**
4. **You'll see "Email Verified!" message**

### **Login as Admin:**
1. **Go to login page**
2. **Enter credentials**:
   ```
   Email: admin@freshcart.local
   Password: admin123
   ```
3. **Click "Sign In"**

## 🎮 **Step 3: Access Admin Features**

### **Find Admin Panel:**
- **Look for "Admin"** in navigation menu
- **Or check profile dropdown**
- **You should see admin dashboard**

### **Admin Features:**
- ✅ **Add Products** - Create new product listings
- ✅ **Edit Products** - Update existing products
- ✅ **Delete Products** - Remove products
- ✅ **View Orders** - Track customer orders
- ✅ **Manage Users** - View registered users
- ✅ **Analytics** - Sales and performance data

## 🔧 **Quick Email Setup (Gmail)**

### **Get Gmail App Password:**
1. **Go to Gmail Settings** → **Security**
2. **Enable 2-Step Verification**
3. **Go to App Passwords**
4. **Generate new app password**
5. **Use this password in Supabase SMTP settings**

### **Test Email:**
1. **Register with your real email**
2. **Check Gmail inbox**
3. **Click verification link**
4. **Verify admin access**

## 🚨 **Troubleshooting**

### **No Email Received?**
1. **Check spam folder**
2. **Verify SMTP settings** in Supabase
3. **Try different email provider**
4. **Check Supabase logs** for email delivery status

### **Admin Panel Not Showing?**
1. **Verify email was confirmed**
2. **Check user role in database**
3. **Refresh browser and re-login**
4. **Clear browser cache**

### **Still Getting Customer Role?**
1. **Ensure you selected "Admin"** during registration
2. **Check user_metadata.role** in Supabase
3. **Verify profile creation** with correct role

## 🌐 **Production Setup**

When deploying to production:
1. **Update Site URL** to your domain
2. **Use professional email service**
3. **Configure proper SMTP settings**
4. **Test email verification thoroughly**

## 🎉 **You're Ready!**

Your FreshCart application now has:
- ✅ **Proper email verification**
- ✅ **Admin role management**
- ✅ **Full admin functionality**
- ✅ **Professional authentication flow**

**Start testing your admin setup now!** 🚀🛒
