import { useState, useEffect } from 'react';
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

type Page = 'home' | 'products' | 'cart' | 'checkout' | 'login' | 'register' | 'profile' | 'orders' | 'admin' | 'auth-callback';

function AppContent() {
  const { loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const path = window.location.pathname.slice(1) || 'home';
    setCurrentPage(path as Page);
  }, []);

  const navigate = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page as Page);
    setPageParams(params || {});
    window.history.pushState({}, '', `/${page}`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'products': return <Products onNavigate={navigate} categorySlug={pageParams.category} />;
      case 'cart': return <Cart onNavigate={navigate} />;
      case 'checkout': return <Checkout onNavigate={navigate} />;
      case 'login': return <Login onNavigate={navigate} />;
      case 'register': return <Register onNavigate={navigate} />;
      case 'profile': return <Profile />;
      case 'orders': return <Orders />;
      case 'admin': return <Admin onNavigate={navigate} />;
      case 'auth-callback': return <AuthCallback />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  // Simple loading - no complex logic
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
    <>
      {currentPage === 'login' || currentPage === 'register' || currentPage === 'auth-callback' ? (
        renderPage()
      ) : (
        <Layout currentPage={currentPage} onNavigate={navigate}>
          {renderPage()}
        </Layout>
      )}
    </>
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
