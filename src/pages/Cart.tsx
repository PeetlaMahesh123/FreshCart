import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface CartProps {
  onNavigate: (page: string) => void;
}

export function Cart({ onNavigate }: CartProps) {
  const { cartItems, cartTotal, loading, updateCartItem, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {cartItems.map((item) => {
                const price = item.product.discount_price || item.product.price;
                const subtotal = price * item.quantity;

                return (
                  <div key={item.id} className="flex items-center gap-4 p-6 border-b border-gray-200 last:border-b-0">
                    <img
                      src={item.product.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        ₹{price} / {item.product.unit}
                      </p>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 mb-2">₹{subtotal.toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{cartTotal >= 500 ? 'FREE' : '₹40'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{(cartTotal + (cartTotal >= 500 ? 0 : 40)).toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
