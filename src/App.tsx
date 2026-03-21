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
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FreshCart...</p>
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
