import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, ShoppingCart, Search, Filter } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  ratings: number;
  unit: string;
  stock: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  categorySlug?: string;
}

export function Products({ onNavigate, categorySlug }: ProductsProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || '');
  const [priceRange, setPriceRange] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange, minRating, searchQuery]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (selectedCategory) {
        const category = categories.find(c => c.slug === selectedCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (minRating > 0) {
        query = query.gte('ratings', minRating);
      }

      const { data } = await query;

      if (data) {
        let filtered = data;

        if (priceRange) {
          const [min, max] = priceRange.split('-').map(Number);
          filtered = filtered.filter(p => {
            const price = p.discount_price || p.price;
            return max ? price >= min && price <= max : price >= min;
          });
        }

        setProducts(filtered);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div>
                <img
                  src={selectedProduct.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={selectedProduct.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(selectedProduct.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-gray-600 ml-2">{selectedProduct.ratings.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{selectedProduct.discount_price || selectedProduct.price}
                  </span>
                  {selectedProduct.discount_price && (
                    <span className="text-xl text-gray-400 line-through ml-3">₹{selectedProduct.price}</span>
                  )}
                  <span className="text-gray-500 ml-2">/ {selectedProduct.unit}</span>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Stock: <span className={selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} ${selectedProduct.unit} available` : 'Out of stock'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleAddToCart(selectedProduct.id)}
                  disabled={selectedProduct.stock === 0}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Prices</option>
                  <option value="0-50">Under ₹50</option>
                  <option value="50-100">₹50 - ₹100</option>
                  <option value="100-200">₹100 - ₹200</option>
                  <option value="200-">Above ₹200</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const price = product.discount_price || product.price;
                  const hasDiscount = product.discount_price !== null;

                  return (
                    <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
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
                        <h3 className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-green-600" onClick={() => setSelectedProduct(product)}>
                          {product.name}
                        </h3>
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
