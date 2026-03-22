import { ReactNode, useState } from 'react';
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Menu,
  X,
  Home,
  ShoppingBag,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import '../styles/components/Layout.css';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  const isActive = (page: string) => currentPage === page;

  const navigation = [
    { name: 'Home', page: 'home', icon: Home },
    { name: 'Products', page: 'products', icon: ShoppingBag },
  ];

  return (
    <div className="layout-container">

      {/* HEADER */}
      <header className="header">

        {/* LOGO */}
        <div className="logo" onClick={() => onNavigate('home')}>
          <Package size={24} />
          <span>FreshCart</span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="nav">
          {user ? (
            <>
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    className={isActive(item.page) ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => onNavigate(item.page)}
                  >
                    <Icon size={16} />
                    {item.name}
                  </button>
                );
              })}

              {/* CART */}
              <button
                className="nav-btn"
                onClick={() => onNavigate('cart')}
              >
                <ShoppingCart size={16} />
                Cart
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </button>

              {/* ORDERS */}
              <button className="nav-btn" onClick={() => onNavigate('orders')}>
                <FileText size={16} /> Orders
              </button>

              {/* PROFILE */}
              <button className="nav-btn" onClick={() => onNavigate('profile')}>
                <User size={16} /> Profile
              </button>

              {/* ADMIN */}
              {profile?.role === 'admin' && (
                <button
                  className="nav-btn"
                  onClick={() => onNavigate('admin')}
                >
                  <LayoutDashboard size={16} /> Admin
                </button>
              )}

              {/* LOGOUT */}
              <button className="logout-btn" onClick={handleSignOut}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className="nav-btn">
                Login
              </button>
              <button onClick={() => onNavigate('register')} className="nav-btn primary">
                Register
              </button>
            </>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </header>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="mobile-menu">

          {/* COMMON */}
          <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>
            <Home size={16} /> Home
          </button>

          <button onClick={() => { onNavigate('products'); setMobileMenuOpen(false); }}>
            <ShoppingBag size={16} /> Products
          </button>

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}>
                Login
              </button>

              <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}>
                Register
              </button>
            </>
          )}

          {/* LOGGED IN */}
          {user && (
            <>
              <button onClick={() => { onNavigate('cart'); setMobileMenuOpen(false); }}>
                <ShoppingCart size={16} /> Cart ({cartCount})
              </button>

              <button onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}>
                <FileText size={16} /> Orders
              </button>

              <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}>
                <User size={16} /> Profile
              </button>

              {profile?.role === 'admin' && (
                <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}>
                  <LayoutDashboard size={16} /> Admin
                </button>
              )}

              <button onClick={handleSignOut}>
                <LogOut size={16} /> Logout
              </button>
            </>
          )}

        </div>
      )}

      {/* MAIN */}
      <main className="main-content">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 FreshCart. All rights reserved.</p>
      </footer>

    </div>
  );
}