import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import '../styles/pages/Checkout.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function Checkout({ onNavigate }: any) {
  const { user, profile } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  // ✅ Load Razorpay script + checks
  useEffect(() => {
    if (!user) {
      onNavigate?.('login');
      return;
    }

    if (cartItems.length === 0) {
      onNavigate?.('cart');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      console.log('✅ Razorpay Loaded');
      setRazorpayLoaded(true);
    };

    script.onerror = () => {
      alert('❌ Failed to load Razorpay');
    };

    document.body.appendChild(script);
  }, [user, cartItems]);

  const deliveryFee = cartTotal >= 500 ? 0 : 40;
  const totalAmount = cartTotal + deliveryFee;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Create order in DB
  const createOrder = async () => {
    if (!user) return;

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          shipping_address: formData.address,
          phone: formData.phone,
          status: 'confirmed',
        })
        .select()
        .single();

      if (error || !order) {
        console.error(error);
        alert("❌ Order creation failed");
        return;
      }

      const items = cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await supabase.from('order_items').insert(items);

      await clearCart();
      alert("✅ Order placed successfully");

      onNavigate?.('orders');

    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    }
  };

  // ✅ Handle Payment
  const handlePayment = () => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert("Payment system loading... try again");
      return;
    }

    if (!user) {
      alert("Login required");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Fill all fields");
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY;

    if (!key) {
      alert("❌ Razorpay key missing in .env");
      return;
    }

    setLoading(true);

    const options = {
      key,
      amount: totalAmount * 100,
      currency: "INR",
      name: "FreshCart",

      handler: async () => {
        await createOrder();
        setLoading(false);
      },

      prefill: {
        name: formData.fullName,
        email: profile?.email,
        contact: formData.phone,
      },

      theme: {
        color: "#16a34a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="checkout-container">

      <h1>Checkout</h1>

      {/* FORM */}
      <div className="checkout-form">

        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />

      </div>

      {/* SUMMARY */}
      <div className="checkout-summary">

        <h2>Order Summary</h2>

        {cartItems.map((item: any) => (
          <div key={item.id} className="summary-item">
            <span>{item.product.name}</span>
            <span>₹{item.product.price}</span>
          </div>
        ))}

        <div className="summary-total">
          Total: ₹{totalAmount.toFixed(2)}
        </div>

        <button onClick={handlePayment} className="primary-btn">
          {loading ? "Processing..." : `Pay ₹${totalAmount}`}
        </button>

      </div>

    </div>
  );
}