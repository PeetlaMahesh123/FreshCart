import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Products.css';

export function Products() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { category } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);

    try {
      if (!category) {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;
        setProducts(data || []);
        return;
      }

      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .maybeSingle();

      if (catError || !catData) {
        console.error("Category not found");
        setProducts([]);
        return;
      }

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

  // WORKING ADD TO CART FUNCTION
  const handleAddToCart = async (productId: string, productName: string) => {
    console.log('🛒 Add to Cart clicked:', { productId, productName, userId: user?.id });
    
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setAddingToCart(productId);
    
    try {
      console.log('🔄 Adding to cart...');
      await addToCart(productId, 1);
      
      // Show success feedback
      alert(`${productName} added to cart!`);
      console.log('✅ Successfully added to cart');
      
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(null);
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
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150";
              }}
            />

            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <p>Stock: {p.stock || 0}</p>

            <button 
              onClick={() => handleAddToCart(p.id, p.name)}
              disabled={addingToCart === p.id || (p.stock || 0) === 0}
              className={addingToCart === p.id ? 'adding' : ''}
            >
              <ShoppingCart size={16} /> 
              {addingToCart === p.id ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="no-products">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
}
