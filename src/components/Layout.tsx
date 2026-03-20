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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100 safe-area-inset">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="relative">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FreshCart
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className={`nav-link ${currentPage === 'home' ? 'text-green-600' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                className={`nav-link ${currentPage === 'products' ? 'text-green-600' : ''}`}
              >
                Products
              </button>
              {user && (
                <button
                  onClick={() => onNavigate('orders')}
                  className={`nav-link ${currentPage === 'orders' ? 'text-green-600' : ''}`}
                >
                  My Orders
                </button>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {user && (
                <button
                  onClick={() => onNavigate('cart')}
                  className="relative p-1.5 sm:p-2 text-gray-700 hover:text-green-600 transition-all duration-300 group"
                >
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {user ? (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => onNavigate('admin')}
                      className="hidden sm:flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden lg:inline">Admin</span>
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate('profile')}
                    className="hidden sm:flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300"
                  >
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden lg:inline max-w-[100px] truncate">
                      {profile?.full_name || 'Profile'}
                    </span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 sm:p-2 text-gray-700 hover:text-red-600 transition-all duration-300 hover:bg-red-50 rounded-xl"
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <button
                    onClick={() => onNavigate('login')}
                    className="hidden sm:block px-3 lg:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-green-600 transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="btn-primary text-xs sm:text-sm px-3 lg:px-4 py-2"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-responsive py-4 space-y-4 animate-fade-in">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className={`block w-full text-left nav-link ${currentPage === 'home' ? 'text-green-600' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('products'); setMobileMenuOpen(false); }}
              className={`block w-full text-left nav-link ${currentPage === 'products' ? 'text-green-600' : ''}`}
            >
              Products
            </button>
            {user && (
              <>
                <button
                  onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}
                  className={`block w-full text-left nav-link ${currentPage === 'orders' ? 'text-green-600' : ''}`}
                >
                  My Orders
                </button>
                <button
                  onClick={() => { onNavigate('cart'); setMobileMenuOpen(false); }}
                  className="flex items-center space-x-2 nav-link"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                </button>
                {profile?.role === 'admin' && (
                  <button
                    onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                )}
              </>
            )}
            {!user && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                  className="block w-full text-left nav-link"
                >
                  Login
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                  className="btn-primary text-sm w-full"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-16 sm:mt-20 border-t border-gray-700">
        <div className="container-responsive py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">FreshCart</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Your trusted source for fresh fruits, vegetables, and premium dry fruits delivered to your doorstep with care and quality.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-xs">i</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li><button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-green-400 transition-colors">Home</button></li>
                <li><button onClick={() => onNavigate('products')} className="text-gray-400 hover:text-green-400 transition-colors">Products</button></li>
                <li><button onClick={() => onNavigate('about')} className="text-gray-400 hover:text-green-400 transition-colors">About Us</button></li>
                <li><button onClick={() => onNavigate('contact')} className="text-gray-400 hover:text-green-400 transition-colors">Contact</button></li>
                {user && <li><button onClick={() => onNavigate('orders')} className="text-gray-400 hover:text-green-400 transition-colors">Orders</button></li>}
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Categories</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li><button className="text-gray-400 hover:text-green-400 transition-colors">Fruits & Vegetables</button></li>
                <li><button className="text-gray-400 hover:text-green-400 transition-colors">Dairy & Eggs</button></li>
                <li><button className="text-gray-400 hover:text-green-400 transition-colors">Bakery Items</button></li>
                <li><button className="text-gray-400 hover:text-green-400 transition-colors">Pantry Staples</button></li>
                <li><button className="text-gray-400 hover:text-green-400 transition-colors">Beverages</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Contact Info</h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                <p className="flex items-center space-x-2">
                  <span className="text-green-400">📧</span>
                  <span className="break-all">support@freshcart.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-green-400">📞</span>
                  <span>+91 1234567890</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="text-green-400">📍</span>
                  <span className="break-words">123 Market Street, Bangalore, India</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-green-400">🕐</span>
                  <span className="break-words">Mon-Sat: 9AM-8PM, Sun: 10AM-6PM</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-xs sm:text-sm text-gray-400">
                &copy; 2026 FreshCart. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <button className="hover:text-green-400 transition-colors">Privacy Policy</button>
                <button className="hover:text-green-400 transition-colors">Terms of Service</button>
                <button className="hover:text-green-400 transition-colors">Refund Policy</button>
                <button className="hover:text-green-400 transition-colors">Shipping Info</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
