import { ReactNode } from 'react';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { cartCount } = useCart();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <Package className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">FreshCart</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className={`${currentPage === 'home' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'} transition-colors`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                className={`${currentPage === 'products' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'} transition-colors`}
              >
                Products
              </button>
              {user && (
                <button
                  onClick={() => onNavigate('orders')}
                  className={`${currentPage === 'orders' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'} transition-colors`}
                >
                  My Orders
                </button>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => onNavigate('cart')}
                  className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {user ? (
                <div className="flex items-center space-x-2">
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => onNavigate('admin')}
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin</span>
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{profile?.full_name || 'Profile'}</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About FreshCart</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for fresh fruits, vegetables, and premium dry fruits delivered to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate('home')} className="hover:text-white">Home</button></li>
                <li><button onClick={() => onNavigate('products')} className="hover:text-white">Products</button></li>
                {user && <li><button onClick={() => onNavigate('orders')} className="hover:text-white">Orders</button></li>}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 text-sm">
                Email: support@freshcart.com<br />
                Phone: +91 1234567890
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2024 FreshCart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
