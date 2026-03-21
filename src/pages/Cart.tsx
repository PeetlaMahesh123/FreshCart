import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import '../styles/pages/Cart.css';

export function Cart({ onNavigate }: any) {
  const { cartItems, cartTotal, updateCartItem, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className="cart-container">

      <button onClick={() => onNavigate?.('home')}>
        <ArrowLeft size={16} /> Back
      </button>

      {cartItems.map(item => {
        const price = item.product.price;

        return (
          <div key={item.id} className="cart-item">

            {/* ✅ FIXED IMAGE */}
            <img
              src={item.product.image_url || "https://via.placeholder.com/100"}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/100";
              }}
            />

            <div>
              <h3>{item.product.name}</h3>

              <button onClick={() => updateCartItem(item.id, item.quantity - 1)}>
                <Minus size={14} />
              </button>

              {item.quantity}

              <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>
                <Plus size={14} />
              </button>

              <button onClick={() => removeFromCart(item.id)}>
                <Trash2 size={16} />
              </button>
            </div>

            <p>₹{price * item.quantity}</p>

          </div>
        );
      })}

      <h2>Total: ₹{cartTotal}</h2>

      <button onClick={() => onNavigate?.('checkout')}>
        Checkout
      </button>

    </div>
  );
}