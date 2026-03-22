import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Products.css';

export function Products() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { category } = useParams(); // slug from URL

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);

    // ✅ If no category → show all
    if (!category) {
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
      setLoading(false);
      return;
    }

    // ✅ Step 1: get category id using slug
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (catError || !catData) {
      console.error("Category not found");
      setProducts([]);
      setLoading(false);
      return;
    }

    // ✅ Step 2: filter products using category_id
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', catData.id);

    if (error) {
      console.error(error);
    }

    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleAddToCart = async (id: string) => {
    if (!user) return navigate('/login');
    await addToCart(id, 1);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="products-container">

      <h1>
        {category ? `${category} Products` : "All Products"}
      </h1>

      <div className="products-grid">
        {products.map(p => (
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