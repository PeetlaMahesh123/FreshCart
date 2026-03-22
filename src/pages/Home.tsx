import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Home.css';

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').limit(8);
    setCategories(data || []);
  }, []);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').limit(8);
    setProducts(data || []);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts()]);
      setLoading(false);
    };
    load();
  }, []);

  const handleAddToCart = async (id: string) => {
    if (!user) return navigate('/login');
    await addToCart(id, 1);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home-container">

      {/* HERO */}
      <div className="hero">
        <h1>FreshCart</h1>
        <p>Fresh & Fast Delivery</p>
        <button onClick={() => navigate('/products')}>
          Shop Now
        </button>
      </div>

      {/* CATEGORIES */}
      <div className="section">
        <h2>Categories</h2>

        <div className="category-grid">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/products/${cat.slug}`)}  // ✅ FIXED
            >
              <div className="category-placeholder">
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="section">
        <h2>Products</h2>

        <div className="product-grid">
          {products.map(p => (
            <div key={p.id} className="product-card">

              <img
                src={p.image_url || "https://via.placeholder.com/200"}
                alt={p.name}
              />

              <h3>{p.name}</h3>
              <p>₹{p.price}</p>

              <button onClick={() => handleAddToCart(p.id)}>
                <ShoppingCart size={16} /> Add
              </button>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}