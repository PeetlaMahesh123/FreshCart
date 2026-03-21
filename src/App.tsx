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

  // Validate Supabase connection on app start
  useEffect(() => {
    const isValid = validateSupabaseConnection();
    if (!isValid) {
      console.error('❌ Application cannot start without valid Supabase connection');
    }
  }, []);

  // Handle navigation
  const handleNavigate = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  // Professional Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto animate-pulse shadow-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full animate-spin border-4 border-transparent border-t-white"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-accent rounded-full animate-bounce"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">FreshCart</h1>
          <p className="text-white/90 animate-pulse">Loading your shopping experience...</p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* IMPORTANT: Show Home directly on root path */}
      <Route path="/" element={<Layout currentPage="home" onNavigate={handleNavigate}><Home /></Layout>} />
      
      {/* Main Pages with Layout */}
      <Route path="/home" element={<Layout currentPage="home" onNavigate={handleNavigate}><Home /></Layout>} />
      <Route path="/products" element={<Layout currentPage="products" onNavigate={handleNavigate}><Products /></Layout>} />
      <Route path="/products/:category" element={<Layout currentPage="products" onNavigate={handleNavigate}><Products /></Layout>} />
      <Route path="/cart" element={<Layout currentPage="cart" onNavigate={handleNavigate}><Cart /></Layout>} />
      <Route path="/checkout" element={<Layout currentPage="checkout" onNavigate={handleNavigate}><Checkout /></Layout>} />
      <Route path="/profile" element={<Layout currentPage="profile" onNavigate={handleNavigate}><Profile /></Layout>} />
      <Route path="/orders" element={<Layout currentPage="orders" onNavigate={handleNavigate}><Orders /></Layout>} />

      {/* Auth pages without Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route path="/admin" element={<Layout currentPage="admin" onNavigate={handleNavigate}><Admin /></Layout>} />
      <Route path="/admin/*" element={<Layout currentPage="admin" onNavigate={handleNavigate}><Admin /></Layout>} />

      {/* Auth */}
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}

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

function App() {
  return <AppWrapper />;
}

export default App;
