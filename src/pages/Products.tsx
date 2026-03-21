import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Products.css';

export function Products({ onNavigate }: any) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { category } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);

    let query = supabase.from('products').select('*');

    if (category && categories.length > 0) {
      const found = categories.find(c => c.slug === category);
      if (found?.id) {
        query = query.eq('category_id', found.id);
      }
    }

    const { data } = await query;
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categories, category]);

  const handleAddToCart = async (id: string) => {
    if (!user) return onNavigate?.('login');
    await addToCart(id, 1);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="products-container">
      <h1>Products</h1>

      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">

            {/* ✅ FIXED IMAGE */}
            <img
              src={p.image_url || "https://via.placeholder.com/150"}
              alt={p.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150";
              }}
            />

            <h3>{p.name}</h3>
            <p>₹{p.price}</p>

            <button onClick={() => handleAddToCart(p.id)}>
              <ShoppingCart size={16} /> Add to Cart
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}