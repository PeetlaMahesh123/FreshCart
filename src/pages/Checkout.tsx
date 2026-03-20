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
      // Always show Razorpay payment interface (even in development)
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_Lk521RZd5XWx9B';
      
      const options = {
        key: razorpayKey,
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'FreshCart',
        description: 'Order Payment',
        handler: async function (response: any) {
          // Payment successful, create order in database
          await createOrder(response.razorpay_payment_id, response.razorpay_order_id || 'direct_order');
        },
        prefill: {
          name: formData.fullName,
          email: profile?.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
          user_id: user!.id,
          total_amount: totalAmount.toString(),
        },
        theme: {
          color: '#16a34a',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
          escape: false,
          backdropclose: false,
          handleback: false,
          confirm_close: true,
          persistent: true
        }
      };

      // Always try to show Razorpay payment interface
      if (window.Razorpay) {
        console.log('Opening Razorpay payment modal...');
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error('Razorpay SDK not loaded');
        alert('Payment gateway not loaded. Please refresh the page and try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-primary py-8">
      <div className="container-responsive">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                <span>Delivery Information</span>
              </h2>
              <form onSubmit={handlePayment} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input pl-10 sm:pl-12"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="input resize-none"
                    placeholder="Enter your complete delivery address"
                  />
                </div>
              </form>
            </div>

            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                <span>Payment Method</span>
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Razorpay</h3>
                    <p className="text-sm text-gray-600">Secure payment via Razorpay</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  You will be redirected to Razorpay's secure payment gateway to complete your payment. 
                  All payment methods including UPI, Credit/Debit cards, and Net Banking are supported.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-4 sm:p-6 sticky top-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.product.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {item.quantity} × ₹{item.product.discount_price || item.product.price}
                      </p>
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">
                      ₹{(item.quantity * (item.product.discount_price || item.product.price)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs sm:text-sm text-green-600">
                    Add ₹{(500 - cartTotal).toFixed(2)} more for free delivery
                  </p>
                )}
                <div className="border-t border-gray-200 pt-2 sm:pt-3">
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="payment-form"
                disabled={loading}
                className="w-full btn-primary mt-6 sm:mt-8 py-3 sm:py-4 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePayment}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Pay ₹{totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
                                  
