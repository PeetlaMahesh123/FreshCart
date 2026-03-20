# 🚀 Create Admin via Supabase Dashboard (Recommended)

## ✅ **Easiest Method: Dashboard Setup**

### **Step 1: Go to Supabase Dashboard**
1. **Open**: https://supabase.com/dashboard
2. **Select your FreshCart project**
3. **Go to Authentication** → **Users**

### **Step 2: Create Admin User**
1. **Click "Add User"** button
2. **Fill admin details**:
   ```
   Email: admin@freshcart.com
   Password: admin123
   Confirm Password: admin123
   ```
3. **Set User Metadata**:
   ```json
   {
     "full_name": "FreshCart Admin",
     "role": "admin",
     "phone": "+1234567890"
   }
   ```
4. **Check "Auto confirm user"** (skip email verification)
5. **Click "Add User"**

### **Step 3: Create Admin Profile**
1. **Go to Table Editor** → **profiles**
2. **Click "Insert new row"**
3. **Fill profile data**:
   ```
   id: [Copy from auth.users table]
   email: admin@freshcart.com
   full_name: FreshCart Admin
   phone: +1234567890
   role: admin
   created_at: [current timestamp]
   updated_at: [current timestamp]
   ```

### **Step 4: Verify Admin Setup**
1. **Check auth.users table** - Find your admin user
2. **Check profiles table** - Verify admin profile exists
3. **Test login** - Use admin credentials

## 🎯 **Alternative: SQL Method**

### **Step 1: Get User ID**
```sql
-- First, create the user
SELECT auth.sign_up('admin@freshcart.com', 'admin123', {
  'data': '{"full_name": "FreshCart Admin", "role": "admin", "phone": "+1234567890"}',
  'email_confirm': true
});
```

### **Step 2: Create Profile**
```sql
-- Get the user ID from the previous step, then:
INSERT INTO profiles (
  id, email, full_name, phone, role, created_at, updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Paste the user ID from Step 1
  'admin@freshcart.com',
  'FreshCart Admin',
  '+1234567890',
  'admin',
  now(),
  now()
);
```

## 🔧 **Quick Setup Commands**

### **Option 1: Dashboard (Recommended)**
1. **Authentication** → **Users** → **Add User**
2. **Set metadata** with role: "admin"
3. **Auto confirm** the user
4. **Create profile** in profiles table

### **Option 2: SQL Editor**
1. **Go to SQL Editor** in Supabase
2. **Run the SQL commands** above
3. **Verify user creation**

## 🚨 **Important Security Notes**

### **For Production:**
- ✅ **Use strong password** (not 'admin123')
- ✅ **Enable 2FA** for admin account
- ✅ **Change email** to your real admin email
- ✅ **Use your real phone number**
- ✅ **Disable auto-confirm** for production

### **For Development:**
- ✅ **Use simple credentials** for testing
- ✅ **Auto-confirm** to skip email verification
- ✅ **Can reset password** anytime

## 🎮 **Test Admin Access**

### **Login Credentials:**
```
Email: admin@freshcart.com
Password: admin123
```

### **Verify Admin Features:**
1. **Login to application**
2. **Check for "Admin"** in navigation
3. **Access admin dashboard**
4. **Test product management**

## 🔍 **Troubleshooting**

### **Admin Panel Not Showing?**
1. **Check user role** in profiles table
2. **Verify role is "admin"** (not "user")
3. **Refresh browser** and re-login
4. **Check browser console** for errors

### **Login Not Working?**
1. **Verify user exists** in auth.users
2. **Check password** is correct
3. **Ensure email_confirmed_at** is not null
4. **Clear browser cache** and try again

### **Profile Not Created?**
1. **Check profiles table** for admin entry
2. **Verify user_id matches** auth.users id
3. **Run profile creation** SQL if missing

## 🎉 **You're Ready!**

Once you complete these steps:
- ✅ **Single admin account** created
- ✅ **Full admin access** to FreshCart
- ✅ **Product management** capabilities
- ✅ **Order and user management**

**Start with the Dashboard method - it's the easiest!** 🚀🛒
