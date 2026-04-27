import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      let { data: cart } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cart) {
        const { data: newCart } = await supabase
          .from('cart')
          .insert([{ user_id: user.id }])
          .select('id')
          .maybeSingle();

        cart = newCart;
      }

      if (!cart) return; // 🔥 Type safety fix

      const { data: items } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          product:products (
            id,
            name,
            price,
            discount_price,
            image_url,
            stock,
            unit
          )
        `)
        .eq('cart_id', cart.id);

      setCartItems(items as unknown as CartItem[] || []);

    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number) => {
    if (!user) return;

    try {
      let { data: cart } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cart) {
        const { data: newCart } = await supabase
          .from('cart')
          .insert([{ user_id: user.id }])
          .select('id')
          .maybeSingle();

        cart = newCart;
      }

      if (!cart) return; // 🔥 fix

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .maybeSingle(); // 🔥 fix

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity
          })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('cart_items')
          .insert([
            {
              cart_id: cart.id,
              product_id: productId,
              quantity
            }
          ]);
      }

      fetchCart();

    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    fetchCart();
  };

  const removeFromCart = async (itemId: string) => {
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;

    const { data: cart } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!cart) return;

    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    fetchCart();
  };

  const refreshCart = async () => fetchCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}