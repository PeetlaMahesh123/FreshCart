# 🛒 FreshCart - Full Stack E-Commerce Application

FreshCart is a modern full-stack e-commerce web application built using **React, TypeScript, Supabase, and Vite**. It includes user authentication, product management, cart functionality, admin dashboard, and secure checkout flow.

---

## 🚀 Live Demo

🔗 https://freshcart-fy0h.onrender.com/

---
## 📸 Screenshots
<img width="1923" height="791" alt="image" src="https://github.com/user-attachments/assets/e9444e9b-085c-417e-a19e-ece9cc1416c2" />
<img width="1923" height="865" alt="image" src="https://github.com/user-attachments/assets/ffea0fe3-b33d-454d-8da9-2e42a4053bae" />
<img width="1917" height="787" alt="image" src="https://github.com/user-attachments/assets/d9f832f5-4c1c-4c7d-aaed-ec44ae1ee946" />
<img width="1910" height="754" alt="image" src="https://github.com/user-attachments/assets/67b58ecb-6108-4b45-b982-73de3546d8fe" />
<img width="1923" height="869" alt="image" src="https://github.com/user-attachments/assets/17eb0d04-2a09-43b5-b2f2-9ed0e0937765" />
<img width="1923" height="867" alt="image" src="https://github.com/user-attachments/assets/eeded2e8-8098-40a1-8b88-9c3901ef24f8" />
<img width="1923" height="820" alt="image" src="https://github.com/user-attachments/assets/1d6ea4f0-6f6b-4e5a-bc10-b081d69480f1" />
<img width="1923" height="824" alt="image" src="https://github.com/user-attachments/assets/60880856-b1fd-4dd4-842b-0110769c257b" />
<img width="1923" height="818" alt="image" src="https://github.com/user-attachments/assets/968a6b4a-8adc-4ac4-aaef-bcb1791f03b2" />
<img width="1923" height="746" alt="image" src="https://github.com/user-attachments/assets/9bc36a28-9dfb-47f1-a401-1329c44c8733" />


---
## 📌 Features

### 👤 User Features

* User Registration with Email Verification
* Secure Login & Logout
* Browse Products
* Add to Cart
* Checkout System
* View Orders
* Profile Management

### 🛠️ Admin Features

* Admin Dashboard
* Manage Products (Add / Delete)
* Manage Orders
* Manage Users
* Role-based Access Control

---

## 🧱 Tech Stack

### Frontend

* React + TypeScript
* Vite
* CSS (Custom + Responsive Design)

### Backend

* Supabase (Auth + Database + API)

### Deployment

* Render

---

## 📂 Project Structure

```
FreshCart/
│
├── .github/workflows/       # CI/CD deployment
│   └── deploy.yml
│
├── public/                  # Static assets
├── dist/                    # Production build
├── node_modules/
│
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx
│   │   ├── AdminHelper.tsx
│   │   └── DebugProducts.tsx
│   │
│   ├── contexts/            # Global state management
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   │
│   ├── lib/                 # Config & utilities
│   │   ├── supabase.ts
│   │   └── database.types.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Orders.tsx
│   │   ├── Profile.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── AuthCallback.tsx
│   │   │
│   │   └── admin/
│   │       ├── Admin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminOrders.tsx
│   │       └── AdminUsers.tsx
│   │
│   ├── styles/
│   │   ├── components/
│   │   └── pages/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── supabase/                # Supabase config
├── .env                     # Environment variables
│
├── SQL Files (Database Setup)
│   ├── create-admin.sql
│   ├── seed-products.sql
│   ├── fix-products-rls.sql
│   └── ...
│
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/PeetlaMahesh123/FreshCart.git
cd freshcart
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup environment variables

Create a `.env` file in root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RAZORPAY_KEY=your_razorpay_key
```

---

### 4️⃣ Setup Supabase

* Create a project in Supabase
* Run SQL files inside `/supabase` or root:

  * `seed-products.sql`
  * `create-admin.sql`
  * `fix-products-rls.sql`

---

### 5️⃣ Run the project

```bash
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

## 🔐 Authentication Flow

* Email/password authentication using Supabase
* Email verification required before login
* Auth callback handled in:

  ```
  src/pages/AuthCallback.tsx
  ```

---

## 🛒 Core Functionalities

### Cart System

* Add/remove products
* Quantity management
* Stored using context API

### Checkout

* Order creation
* Data stored in Supabase

### Admin Panel

Accessible only for admin users:

```
/admin
```

---

## 🧪 Debug & Fix Scripts

Project includes SQL and debug tools:

* `debug-products.sql`
* `fix-cart.sql`
* `fix-orders.sql`
* `REAL_FIX.sql`

Used for:

* Fixing database issues
* Debugging product loading
* Managing permissions (RLS)

---

## 🚀 Deployment

### Render Deployment

1. Build command:

```bash
npm run build
```

2. Publish directory:

```
dist
```

---

## 🧠 Best Practices Used

* Modular folder structure
* Context API for state management
* Reusable components
* Responsive UI design
* Secure authentication (Supabase)
* Role-based authorization

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 👨‍💻 Author

Mahesh Peetla
GitHub: https://github.com/PeetlaMahesh123

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
