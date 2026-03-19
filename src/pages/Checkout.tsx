import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { CreditCard, MapPin, Phone } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

export function Checkout({ onNavigate }: CheckoutProps) {
  const { user, profile } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  useEffect(() => {
    if (!user) {
      onNavigate('login');
      return;
    }

    if (cartItems.length === 0) {
      onNavigate('cart');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [user, cartItems]);

  const deliveryFee = cartTotal >= 500 ? 0 : 40;
  const totalAmount = cartTotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createOrder = async (paymentId: string, razorpayOrderId: string) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          total_amount: totalAmount,
          shipping_address: formData.address,
          phone: formData.phone,
          status: 'confirmed',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.discount_price || item.product.price,
      }));

      await supabase.from('order_items').insert(orderItems);

      await supabase.from('payments').insert({
        order_id: order.id,
        user_id: user!.id,
        amount: totalAmount,
        payment_method: 'razorpay',
        razorpay_payment_id: paymentId,
        razorpay_order_id: razorpayOrderId,
        status: 'success',
      });

      await clearCart();
      onNavigate('orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please contact support.');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const options = {
        key: 'rzp_test_dummy_key',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'FreshCart',
        description: 'Order Payment',
        handler: async function (response: any) {
          await createOrder(response.razorpay_payment_id, response.razorpay_order_id || 'test_order_id');
        },
        prefill: {
          name: formData.fullName,
          email: profile?.email,
          contact: formData.phone,
        },
        theme: {
          color: '#16a34a',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert('Payment gateway not loaded. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Delivery Information</span>
              </h2>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>₹{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="h-5 w-5" />
                <span>{loading ? 'Processing...' : 'Pay Now'}</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
