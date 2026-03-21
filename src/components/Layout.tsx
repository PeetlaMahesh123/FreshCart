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
    onNavigate && onNavigate('home');
  };

  const navLinkClass = (active: boolean) => 
    `nav-link ${active ? 'active' : ''} hover:bg-neutral-50 transition-colors`;

  const safeNavigate = (page: string) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(page);
    } else {
      console.warn('onNavigate is not available or not a function');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Professional Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-neutral-200">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => safeNavigate('home')}
            >
              <div className="relative">
                <Package className="h-8 w-8 text-brand-primary group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-brand-secondary rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                FreshCart
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => safeNavigate('home')}
                className={navLinkClass(currentPage === 'home')}
              >
                Home
              </button>
              <button
                onClick={() => safeNavigate('products')}
                className={navLinkClass(currentPage === 'products')}
              >
                Products
              </button>
              {user && (
                <>
                  <button
                    onClick={() => safeNavigate('orders')}
                    className={navLinkClass(currentPage === 'orders')}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => safeNavigate('profile')}
                    className={navLinkClass(currentPage === 'profile')}
                  >
                    Profile
                  </button>
                </>
              )}
              {profile?.role === 'admin' && (
                <button
                  onClick={() => safeNavigate('admin')}
                  className={navLinkClass(currentPage === 'admin')}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin
                </button>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <button
                onClick={() => safeNavigate('cart')}
                className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-neutral-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-white rounded-full px-2 py-1 text-xs font-bold min-w-6 text-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-600 hidden sm:block">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:block">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => safeNavigate('login')}
                    className="btn btn-outline"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => safeNavigate('register')}
                    className="btn btn-primary"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-neutral-600" />
                ) : (
                  <Menu className="h-6 w-6 text-neutral-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 border-b border-neutral-200">
          <div className="container">
            <div className="flex flex-col gap-2 py-4">
              <button
                onClick={() => { safeNavigate('home'); setMobileMenuOpen(false); }}
                className={navLinkClass(currentPage === 'home')}
              >
                Home
              </button>
              <button
                onClick={() => { safeNavigate('products'); setMobileMenuOpen(false); }}
                className={navLinkClass(currentPage === 'products')}
              >
                Products
              </button>
              {user && (
                <>
                  <button
                    onClick={() => { safeNavigate('orders'); setMobileMenuOpen(false); }}
                    className={navLinkClass(currentPage === 'orders')}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => { safeNavigate('profile'); setMobileMenuOpen(false); }}
                    className={navLinkClass(currentPage === 'profile')}
                  >
                    Profile
                  </button>
                </>
              )}
              {profile?.role === 'admin' && (
                <button
                  onClick={() => { safeNavigate('admin'); setMobileMenuOpen(false); }}
                  className={navLinkClass(currentPage === 'admin')}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin
                </button>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="pb-8">
        {children}
      </main>

      {/* Professional Footer */}
      <footer className="bg-neutral-900 text-white border-t border-neutral-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-8 w-8 text-brand-secondary" />
                <span className="text-xl font-bold">FreshCart</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Your trusted online marketplace for fresh products and quality goods.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors cursor-pointer">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors cursor-pointer">
                  <span className="text-xs">i</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => safeNavigate('home')}
                  className="block text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </button>
                <button
                  onClick={() => safeNavigate('products')}
                  className="block text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Products
                </button>
                <button
                  onClick={() => safeNavigate('orders')}
                  className="block text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Orders
                </button>
                <button
                  onClick={() => safeNavigate('profile')}
                  className="block text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Profile
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Categories</h3>
              <div className="space-y-2">
                <button className="block text-neutral-400 hover:text-white transition-colors text-sm">
                  Electronics
                </button>
                <button className="block text-neutral-400 hover:text-white transition-colors text-sm">
                  Clothing
                </button>
                <button className="block text-neutral-400 hover:text-white transition-colors text-sm">
                  Home & Garden
                </button>
                <button className="block text-neutral-400 hover:text-white transition-colors text-sm">
                  Sports
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Support</h3>
              <div className="space-y-2">
                <button className="block text-neutral-400 hover:text-white transition-colors text-sm">
                  Help Center
                </button>
                <button className="block text-neutral-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </button>
                <button className="block text-neutral-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </button>
                <button className="block text-neutral-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-neutral-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-neutral-400 text-sm">
                © 2024 FreshCart. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-neutral-400">
                <span>Powered by React & Supabase</span>
                <span>•</span>
                <span>Made with ❤️</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
