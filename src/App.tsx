import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

  // Validate Supabase connection on app start
  useEffect(() => {
    const isValid = validateSupabaseConnection();
    if (!isValid) {
      console.error('❌ Application cannot start without valid Supabase connection');
    }
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '4px solid #10b981',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading FreshCart...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* IMPORTANT: Show Home directly on root path */}
        <Route path="/" element={<Layout currentPage="home"><Home /></Layout>} />
        
        {/* Main Pages with Layout */}
        <Route path="/home" element={<Layout currentPage="home"><Home /></Layout>} />
        <Route path="/products" element={<Layout currentPage="products"><Products /></Layout>} />
        <Route path="/products/:category" element={<Layout currentPage="products"><Products /></Layout>} />
        <Route path="/cart" element={<Layout currentPage="cart"><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout currentPage="checkout"><Checkout /></Layout>} />
        <Route path="/profile" element={<Layout currentPage="profile"><Profile /></Layout>} />
        <Route path="/orders" element={<Layout currentPage="orders"><Orders /></Layout>} />

        {/* Auth pages without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={<Layout currentPage="admin"><Admin /></Layout>} />
        <Route path="/admin/*" element={<Layout currentPage="admin"><Admin /></Layout>} />

        {/* Auth */}
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </HashRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
