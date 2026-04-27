import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import '../styles/pages/Products.css';

export function Products() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { category } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch products
  const fetchProducts = async () => {
    setLoading(true);

    try {
      // 👉 If no category → get all products
      if (!category) {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        setProducts(data || []);
        return;
      }

      // 👉 Step 1: get category id
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .maybeSingle(); // 🔥 safe

      if (catError || !catData) {
        console.error("Category not found");
        setProducts([]);
        return;
      }

      // 👉 Step 2: fetch products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', catData.id);

      if (error) throw error;

      setProducts(data || []);

    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // 🔥 FIXED ADD TO CART
  const handleAddToCart = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      await addToCart(productId, 1);

    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  if (loading) {
    return <div className="products-container">Loading...</div>;
  }

  return (
    <div className="products-container">

      <h1>
        {category ? `${category} Products` : "All Products"}
      </h1>

      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">

            <img
              src={p.image_url || "https://via.placeholder.com/150"}
              alt={p.name}
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