import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Cart.css';

export function Cart() {
  const navigate = useNavigate();

  const { cartItems, cartTotal, updateCartItem, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return <div className="cart-container">Your cart is empty</div>;
  }

  return (
    <div className="cart-container">

      {/* Back */}
      <button onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back
      </button>

      {cartItems.map(item => {
        const price = item.product.price;

        return (
          <div key={item.id} className="cart-item">

            <img
              src={item.product.image_url || "https://via.placeholder.com/100"}
              alt={item.product.name}
            />

            <div>
              <h3>{item.product.name}</h3>

              <div className="qty-controls">
                <button onClick={() => updateCartItem(item.id, item.quantity - 1)}>
                  <Minus size={14} />
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>
                  <Plus size={14} />
                </button>

                <button onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p>₹{price * item.quantity}</p>

          </div>
        );
      })}

      <h2>Total: ₹{cartTotal}</h2>

      {/* ✅ FIXED BUTTON */}
      <button
        className="checkout-btn"
        onClick={() => navigate('/checkout')}
      >
        Checkout
      </button>

    </div>
  );
}