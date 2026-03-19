import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  image_url: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  ratings: number;
  unit: string;
  stock: number;
}

interface HomeProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).limit(6),
        supabase.from('products').select('*').eq('is_active', true).order('ratings', { ascending: false }).limit(8),
      ]);

      if (categoriesData.data) setCategories(categoriesData.data);
      if (productsData.data) setFeaturedProducts(productsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Fresh & Organic</h1>
            <p className="text-xl mb-8">Fruits, Vegetables & Dry Fruits Delivered to Your Door</p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onNavigate('products', { category: category.slug })}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-3 text-center">{category.image_url || '🥗'}</div>
                <h3 className="text-center font-semibold text-gray-900">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <button
              onClick={() => onNavigate('products')}
              className="text-green-600 font-semibold hover:text-green-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const price = product.discount_price || product.price;
              const hasDiscount = product.discount_price !== null;

              return (
                <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {hasDiscount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                        {Math.round(((product.price - price) / product.price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.ratings.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-green-600">₹{price}</span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through ml-2">₹{product.price}</span>
                        )}
                        <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Delivery</h3>
              <p className="text-gray-600">On orders above ₹500</p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Organic</h3>
              <p className="text-gray-600">Fresh from farms</p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Quality at affordable rates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
