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
      console.log('🛒 Fetching cart for user:', user.id);

      // Get user's cart
      let { data: cart, error: cartError } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('📦 Cart result:', { cart, cartError });

      if (cartError) {
        console.error('❌ Cart error:', cartError);
        setCartItems([]);
        setLoading(false);
        return;
      }

      if (!cart) {
        console.log('➕ Creating new cart');
        const { data: newCart, error: insertError } = await supabase
          .from('cart')
          .insert([{ user_id: user.id }])
          .select('id')
          .maybeSingle();

        if (insertError) {
          console.error('❌ Cart creation error:', insertError);
          setCartItems([]);
          setLoading(false);
          return;
        }

        cart = newCart;
        console.log('🆕 New cart created:', cart);
      }

      if (!cart) {
        console.error('❌ No cart available');
        setCartItems([]);
        setLoading(false);
        return;
      }

      // Get cart items with product info
      const { data: items, error: itemsError } = await supabase
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

      console.log('📦 Cart items:', { items, itemsError });

      if (itemsError) {
        console.error('❌ Cart items error:', itemsError);
        setCartItems([]);
      } else {
        setCartItems(items as unknown as CartItem[] || []);
        console.log('✅ Cart loaded with items:', items?.length || 0);
      }

    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number) => {
    console.log('🛒 addToCart called:', { productId, quantity, user: user?.id });
    
    if (!user) {
      console.error('❌ No user found');
      return;
    }

    try {
      // Get or create cart
      let { data: cart, error: cartError } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cartError) {
        console.error('❌ Cart fetch error:', cartError);
        return;
      }

      if (!cart) {
        console.log('➕ Creating new cart for add to cart');
        const { data: newCart, error: insertError } = await supabase
          .from('cart')
          .insert([{ user_id: user.id }])
          .select('id')
          .maybeSingle();

        if (insertError) {
          console.error('❌ Cart creation error:', insertError);
          return;
        }

        cart = newCart;
      }

      if (!cart) {
        console.error('❌ Failed to get cart');
        return;
      }

      console.log('📦 Using cart:', cart.id);

      // Check if item already exists
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Check existing item error:', checkError);
        return;
      }

      console.log('📦 Existing item:', existingItem);

      let operationError;
      
      if (existingItem) {
        // Update existing item
        const { error } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity
          })
          .eq('id', existingItem.id);

        operationError = error;
        console.log('🔄 Updated item:', { error });
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert([
            {
              cart_id: cart.id,
              product_id: productId,
              quantity
            }
          ]);

        operationError = error;
        console.log('➕ Added new item:', { error });
      }

      if (operationError) {
        console.error('❌ Cart operation failed:', operationError);
        return;
      }

      console.log('✅ Cart operation successful, refreshing...');
      
      // Refresh cart to get updated items
      await fetchCart();

    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      console.error('❌ Error updating cart item:', error);
    } else {
      fetchCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('❌ Error removing cart item:', error);
    } else {
      fetchCart();
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const { data: cart } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!cart) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (error) {
      console.error('❌ Error clearing cart:', error);
    } else {
      fetchCart();
    }
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
