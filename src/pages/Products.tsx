import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, ShoppingCart, Search, Filter } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Product, Category } from '../types';

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
    <div className="min-h-screen gradient-primary">
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 safe-area-inset animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-premium" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src={selectedProduct.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={selectedProduct.name}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    In Stock
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">{selectedProduct.name}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2 sm:mb-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(selectedProduct.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-gray-600 ml-2 text-sm sm:text-base font-medium">{selectedProduct.ratings.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-400 text-sm">|</span>
                    <span className="text-gray-600 text-sm">{selectedProduct.total_reviews} reviews</span>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">{selectedProduct.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2 sm:space-x-3">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
                      ₹{selectedProduct.discount_price || selectedProduct.price}
                    </span>
                    {selectedProduct.discount_price && (
                      <span className="text-lg sm:text-2xl text-gray-400 line-through">₹{selectedProduct.price}</span>
                    )}
                    <span className="text-sm sm:text-base sm:text-lg text-gray-500">/ {selectedProduct.unit}</span>
                  </div>
                  {selectedProduct.discount_price && (
                    <div className="inline-flex items-center bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      Save ₹{selectedProduct.price - selectedProduct.discount_price} ({Math.round(((selectedProduct.price - (selectedProduct.discount_price || selectedProduct.price)) / selectedProduct.price) * 100)}% OFF)
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Stock: <span className={selectedProduct.stock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} ${selectedProduct.unit} available` : 'Out of stock'}
                    </span>
                  </p>
                </div>
                
                <button
                  onClick={() => handleAddToCart(selectedProduct.id)}
                  disabled={selectedProduct.stock === 0}
                  className="w-full btn-primary flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base lg:text-lg py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <span>{selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-responsive py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Fresh Products
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Discover our curated selection of fresh, high-quality products delivered right to your doorstep
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center px-4">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for fresh products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 w-full lg:w-auto"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 sm:mb-12 card p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input text-sm sm:text-base"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="input text-sm sm:text-base"
                >
                  <option value="">All Prices</option>
                  <option value="0-50">Under ₹50</option>
                  <option value="50-100">₹50 - ₹100</option>
                  <option value="100-200">₹100 - ₹200</option>
                  <option value="200-">Above ₹200</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="input text-sm sm:text-base"
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
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full mb-4 sm:mb-6">
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setPriceRange('');
                    setMinRating(0);
                  }}
                  className="btn-secondary text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {products.map((product) => {
                  const price = product.discount_price || product.price;
                  const hasDiscount = product.discount_price !== null;

                  return (
                    <div key={product.id} className="card card-hover group">
                      <div className="relative overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <div className="aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={product.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        {hasDiscount && (
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                            {Math.round(((product.price - price) / product.price) * 100)}% OFF
                          </div>
                        )}
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                          Fresh
                        </div>
                      </div>
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 cursor-pointer hover:text-green-600 transition-colors line-clamp-2" onClick={() => setSelectedProduct(product)}>
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600">{product.ratings.toFixed(1)}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">({product.total_reviews})</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">₹{price}</span>
                            {hasDiscount && (
                              <span className="text-sm sm:text-base text-gray-400 line-through ml-2">₹{product.price}</span>
                            )}
                            <span className="text-xs sm:text-sm text-gray-500 ml-1">/ {product.unit}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.stock === 0}
                          className="w-full btn-primary flex items-center justify-center space-x-2 py-2 sm:py-3 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
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
