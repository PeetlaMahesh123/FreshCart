import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function DebugProducts() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debugDatabase = async () => {
      try {
        // Test basic connection
        const { data: testData, error: testError } = await supabase
          .from('categories')
          .select('count')
          .single();

        // Get categories count
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true);

        // Get products count
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        // Get products with categories
        const { data: productsWithCategories, error: joinError } = await supabase
          .from('products')
          .select(`
            *,
            categories:category_id (
              id,
              name,
              slug
            )
          `)
          .eq('is_active', true)
          .limit(5);

        setDebugInfo({
          connection: { data: testData, error: testError },
          categories: { 
            count: categories?.length || 0, 
            data: categories?.slice(0, 3), 
            error: categoriesError 
          },
          products: { 
            count: products?.length || 0, 
            data: products?.slice(0, 3), 
            error: productsError 
          },
          productsWithCategories: { 
            count: productsWithCategories?.length || 0, 
            data: productsWithCategories, 
            error: joinError 
          },
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          hasEnvVars: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
        });
      } catch (error) {
        setDebugInfo({ error: (error as Error).message });
      } finally {
        setLoading(false);
      }
    };

    debugDatabase();
  }, []);

  if (loading) {
    return <div className="p-4">Loading debug info...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Database Debug Information</h2>
      
      <div className="space-y-4">
        <div className="p-3 bg-gray-100 rounded">
          <h3 className="font-semibold">Connection Status</h3>
          <p>Environment Variables: {debugInfo.hasEnvVars ? '✅ Present' : '❌ Missing'}</p>
          <p>Supabase URL: {debugInfo.supabaseUrl}</p>
        </div>

        <div className="p-3 bg-blue-50 rounded">
          <h3 className="font-semibold">Categories</h3>
          <p>Count: {debugInfo.categories?.count || 0}</p>
          {debugInfo.categories?.error && <p className="text-red-500">Error: {debugInfo.categories.error.message}</p>}
          {debugInfo.categories?.data && (
            <div className="mt-2">
              {debugInfo.categories.data.map((cat: any) => (
                <p key={cat.id} className="text-sm">- {cat.name} ({cat.slug})</p>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-green-50 rounded">
          <h3 className="font-semibold">Products</h3>
          <p>Count: {debugInfo.products?.count || 0}</p>
          {debugInfo.products?.error && <p className="text-red-500">Error: {debugInfo.products.error.message}</p>}
          {debugInfo.products?.data && (
            <div className="mt-2">
              {debugInfo.products.data.map((product: any) => (
                <p key={product.id} className="text-sm">- {product.name} - ₹{product.price}</p>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-yellow-50 rounded">
          <h3 className="font-semibold">Products with Categories (Join)</h3>
          <p>Count: {debugInfo.productsWithCategories?.count || 0}</p>
          {debugInfo.productsWithCategories?.error && <p className="text-red-500">Error: {debugInfo.productsWithCategories.error.message}</p>}
          {debugInfo.productsWithCategories?.data && (
            <div className="mt-2">
              {debugInfo.productsWithCategories.data.map((item: any) => (
                <p key={item.id} className="text-sm">- {item.name} (Category: {item.categories?.name || 'None'})</p>
              ))}
            </div>
          )}
        </div>

        {debugInfo.error && (
          <div className="p-3 bg-red-50 rounded">
            <h3 className="font-semibold text-red-600">General Error</h3>
            <p>{debugInfo.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
