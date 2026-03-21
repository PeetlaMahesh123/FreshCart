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
  FileText,
  Users
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
  };

  const isActive = (page: string) => currentPage === page;

  const navigation = [
    { name: 'Home', page: 'home', icon: Home },
    { name: 'Products', page: 'products', icon: ShoppingBag },
    { name: 'Cart', page: 'cart', icon: ShoppingCart },
    { name: 'Orders', page: 'orders', icon: FileText },
    { name: 'Profile', page: 'profile', icon: User },
  ];

  return (
    <div className="layout-container">

      {/* HEADER */}
      <header className="header">

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
                    {item.page === 'cart' && cartCount > 0 && (
                      <span className="badge">{cartCount}</span>
                    )}
                  </button>
                );
              })}

              {profile?.role === 'admin' && (
                <button
                  className="nav-btn"
                  onClick={() => onNavigate('admin')}
                >
                  <LayoutDashboard size={16} /> Admin
                </button>
              )}

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

        {/* MOBILE */}
        <button
          className="menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={16} /> {item.name}
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN */}
      <main className="main-content">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2024 FreshCart. All rights reserved.</p>
      </footer>

    </div>
  );
}