import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function AppContent() {
  const { loading } = useAuth();

  // Simple loading state
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
    <BrowserRouter basename="/FreshCart">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:category" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
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
