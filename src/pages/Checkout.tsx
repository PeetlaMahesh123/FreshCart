import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Checkout.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function Checkout() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  const deliveryFee = cartTotal >= 500 ? 0 : 40;
  const totalAmount = cartTotal + deliveryFee;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ✅ Create Order */
  const createOrder = async () => {
    if (!user) return;

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
      .maybeSingle();

    if (error || !order) {
      alert("Order failed");
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
    alert("Order placed successfully");
    navigate('/orders');
  };

  /* ✅ FINAL PAYMENT FUNCTION */
  const handlePayment = () => {
    console.log("PAY CLICKED");

    if (!window.Razorpay) {
      alert("Razorpay not loaded");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Fill all fields");
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY;

    console.log("KEY:", key);

    if (!key) {
      alert("Razorpay key missing");
      return;
    }

    const options = {
      key: key,
      amount: totalAmount * 100,
      currency: "INR",
      name: "FreshCart",
      description: "Order Payment",
      image: "/logo.png", // Use relative path to avoid localhost issues

      handler: async function () {
        await createOrder();
      },

      prefill: {
        name: formData.fullName,
        email: profile?.email || '',
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
          placeholder="Phone Number"
        />

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Delivery Address"
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
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        {/* ✅ BUTTON FIXED */}
        <button onClick={handlePayment} className="primary-btn">
          {loading ? "Processing..." : `Pay ₹${totalAmount}`}
        </button>
      </div>

    </div>
  );
}