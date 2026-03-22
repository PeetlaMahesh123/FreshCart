import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/Layout';

import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { Admin } from './pages/Admin';
import { AuthCallback } from './pages/AuthCallback';

import { validateSupabaseConnection } from './lib/supabase';

function AppContent() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isValid = validateSupabaseConnection();
    if (!isValid) {
      console.error('❌ Supabase connection failed');
    }
  }, []);

  const handleNavigate = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Routes>

      {/* ✅ Home */}
      <Route
        path="/"
        element={
          <Layout currentPage="home" onNavigate={handleNavigate}>
            <Home />
          </Layout>
        }
      />

      {/* ✅ Products */}
      <Route
        path="/products"
        element={
          <Layout currentPage="products" onNavigate={handleNavigate}>
            <Products />
          </Layout>
        }
      />

      <Route
        path="/products/:category"
        element={
          <Layout currentPage="products" onNavigate={handleNavigate}>
            <Products />
          </Layout>
        }
      />

      {/* ✅ Cart */}
      <Route
        path="/cart"
        element={
          <Layout currentPage="cart" onNavigate={handleNavigate}>
            <Cart />
          </Layout>
        }
      />

      {/* ✅ Checkout */}
      <Route
        path="/checkout"
        element={
          <Layout currentPage="checkout" onNavigate={handleNavigate}>
            <Checkout />
          </Layout>
        }
      />

      {/* ✅ Profile */}
      <Route
        path="/profile"
        element={
          <Layout currentPage="profile" onNavigate={handleNavigate}>
            <Profile />
          </Layout>
        }
      />

      {/* ✅ Orders */}
      <Route
        path="/orders"
        element={
          <Layout currentPage="orders" onNavigate={handleNavigate}>
            <Orders />
          </Layout>
        }
      />

      {/* ✅ Admin */}
      <Route
        path="/admin"
        element={
          <Layout currentPage="admin" onNavigate={handleNavigate}>
            <Admin />
          </Layout>
        }
      />

      {/* ✅ Auth */}
      <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
      <Route path="/register" element={<Register onNavigate={handleNavigate} />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* ✅ 🔥 IMPORTANT FIX (fallback route) */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

/* Wrapper */
function AppWrapper() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default function App() {
  return <AppWrapper />;
}