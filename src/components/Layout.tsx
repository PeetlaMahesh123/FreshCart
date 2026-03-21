import { ReactNode } from 'react';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

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

  const navLinkStyle = (active: boolean) => ({
    color: active ? '#059669' : '#374151',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    cursor: 'pointer',
    padding: '0.5rem 0'
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
    }}>
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        position: 'sticky' as const,
        top: '0',
        zIndex: '50',
        borderBottom: '1px solid #f3f4f6',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '3.5rem'
          }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer'
              }}
              onClick={() => onNavigate('home')}
            >
              <div style={{ position: 'relative' as const }}>
                <Package 
                  style={{
                    height: '2rem',
                    width: '2rem',
                    color: '#059669',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <div style={{
                  position: 'absolute' as const,
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
              </div>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #059669, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                FreshCart
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem'
            }} className="desktop-nav">
              <button
                onClick={() => onNavigate('home')}
                style={navLinkStyle(currentPage === 'home')}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                style={navLinkStyle(currentPage === 'products')}
              >
                Products
              </button>
              {user && (
                <>
                  <button
                    onClick={() => onNavigate('orders')}
                    style={navLinkStyle(currentPage === 'orders')}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => onNavigate('profile')}
                    style={navLinkStyle(currentPage === 'profile')}
                  >
                    Profile
                  </button>
                </>
              )}
              {profile?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  style={navLinkStyle(currentPage === 'admin')}
                >
                  <LayoutDashboard style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                  Admin
                </button>
              )}
            </nav>

            {/* Right side actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {/* Cart */}
              <button
                onClick={() => onNavigate('cart')}
                style={{
                  position: 'relative' as const,
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <ShoppingCart style={{ height: '1.5rem', width: '1.5rem', color: '#374151' }} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute' as const,
                    top: '0',
                    right: '0',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    borderRadius: '9999px',
                    padding: '0.125rem 0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    minWidth: '1.25rem',
                    textAlign: 'center'
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <LogOut style={{ height: '1rem', width: '1rem' }} />
                    <span className="desktop-signout">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => onNavigate('login')}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '2px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    style={{
                      background: 'linear-gradient(to right, #059669, #10b981)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                className="mobile-menu-button"
              >
                {mobileMenuOpen ? (
                  <X style={{ height: '1.5rem', width: '1.5rem', color: '#374151' }} />
                ) : (
                  <Menu style={{ height: '1.5rem', width: '1.5rem', color: '#374151' }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav style={{
          position: 'fixed' as const,
          top: '4rem',
          left: '0',
          right: '0',
          backgroundColor: 'white',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: '40',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              style={navLinkStyle(currentPage === 'home')}
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('products'); setMobileMenuOpen(false); }}
              style={navLinkStyle(currentPage === 'products')}
            >
              Products
            </button>
            {user && (
              <>
                <button
                  onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}
                  style={navLinkStyle(currentPage === 'orders')}
                >
                  Orders
                </button>
                <button
                  onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
                  style={navLinkStyle(currentPage === 'profile')}
                >
                  Profile
                </button>
              </>
            )}
            {profile?.role === 'admin' && (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                style={navLinkStyle(currentPage === 'admin')}
              >
                <LayoutDashboard style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                Admin
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main style={{ paddingBottom: '2rem' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        padding: '2rem 0',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            © 2024 FreshCart. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-signout {
            display: inline !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
