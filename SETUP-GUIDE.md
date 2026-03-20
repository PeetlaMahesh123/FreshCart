# FreshCart User & Admin Setup Guide

## 🎯 Complete Registration & Login System

Your FreshCart application now has a clear role-based registration system. Here's how to use it:

---

## 📱 Step-by-Step Guide

### 1. **Customer Registration**
1. Go to: `http://localhost:5173/register`
2. Select **Customer** (green option with shopping cart icon)
3. Fill in your details:
   - Full Name
   - Email Address
   - Phone (optional)
   - Password (6+ characters)
   - Confirm Password
4. Click **Create Account**
5. You'll be automatically logged in as a customer

### 2. **Admin Registration**
1. Go to: `http://localhost:5173/register`
2. Select **Admin** (purple option with crown icon)
3. Fill in your details:
   - Full Name: "Admin User"
   - Email: `admin@freshcart.com`
   - Password: `admin123`
   - Confirm Password: `admin123`
4. Click **Create Account**
5. You'll be redirected to login page

### 3. **Make User Admin**
After registering as admin, you need to activate admin privileges:

1. **Login** with your admin credentials
2. Go to **Products** page
3. Look for the **"Admin Helper"** box (yellow background)
4. Enter your admin email: `admin@freshcart.com`
5. Click **"Make Admin"**
6. You should see success message

### 4. **Access Admin Panel**
1. **Logout** and **login again** with admin credentials
2. You'll now see a purple **"Admin"** button in the navigation
3. Click **Admin** to access:
   - 📊 Dashboard (overview)
   - 👥 Users Management
   - 📦 Products Management (add/edit/delete)
   - 🛒 Orders Management

---

## 🔐 Test Accounts

### Customer Account
- **Email**: `customer@freshcart.com`
- **Password**: `customer123`
- **Access**: Browse, Shop, Cart, Checkout, Orders

### Admin Account
- **Email**: `admin@freshcart.com`
- **Password**: `admin123`
- **Access**: All customer features + Admin Panel

---

## 🚀 Quick Start

### For Testing as Customer:
1. Register as customer (or use test account)
2. Browse products
3. Add items to cart
4. Checkout
5. View orders

### For Testing as Admin:
1. Register as admin with `admin@freshcart.com`
2. Use Admin Helper to activate admin role
3. Login again
4. Access Admin Panel
5. Add/edit products
6. Manage orders

---

## 🛠️ Features Available

### Customer Features:
- ✅ Product browsing
- ✅ Search & filter products
- ✅ Add to cart
- ✅ View cart
- ✅ Checkout process
- ✅ Order history
- ✅ Profile management

### Admin Features:
- ✅ Dashboard with statistics
- ✅ User management
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Category management

---

## 🔧 Troubleshooting

### If Admin Panel doesn't appear:
1. Make sure you completed the "Make Admin" step
2. Logout and login again
3. Check that your profile has role = 'admin'

### If products don't show:
1. Check that you ran the permission fix SQL
2. Verify products were inserted correctly
3. Check the debug panel for errors

### If registration fails:
1. Check email format
2. Ensure password is 6+ characters
3. Check network connection

---

## 📝 Notes

- All users register as 'user' by default
- Admin role must be assigned separately
- Only admins can access the Admin Panel
- The system automatically detects user roles
- Debug components can be removed after setup

This system provides a complete e-commerce experience with proper role separation and security!
