import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
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

type Page = 'home' | 'products' | 'cart' | 'checkout' | 'login' | 'register' | 'profile' | 'orders' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'home';
      setCurrentPage(path as Page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: Page, params?: Record<string, string>) => {
    setCurrentPage(page);
    setPageParams(params || {});
    window.history.pushState({}, '', `/${page}`);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'products':
        return <Products onNavigate={navigate} categorySlug={pageParams.category} />;
      case 'cart':
        return <Cart onNavigate={navigate} />;
      case 'checkout':
        return <Checkout onNavigate={navigate} />;
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'register':
        return <Register onNavigate={navigate} />;
      case 'profile':
        return <Profile />;
      case 'orders':
        return <Orders />;
      case 'admin':
        return <Admin onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        {currentPage === 'login' || currentPage === 'register' ? (
          renderPage()
        ) : (
          <Layout currentPage={currentPage} onNavigate={navigate}>
            {renderPage()}
          </Layout>
        )}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
