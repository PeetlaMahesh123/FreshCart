import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/components/DebugProducts.css';

export function DebugProducts() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debugDatabase = async () => {
      try {
        const { data: categories } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true);

        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        const { data: productsWithCategories } = await supabase
          .from('products')
          .select(`
            *,
            categories:category_id (id, name, slug)
          `)
          .limit(5);

        setDebugInfo({
          categories,
          products,
          productsWithCategories,
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
    return <div className="debug-loading">Loading debug info...</div>;
  }

  return (
    <div className="debug-container">

      <h2>Database Debug Information</h2>

      {/* CONNECTION */}
      <div className="debug-box">
        <h3>Connection</h3>
        <p>Env Vars: {debugInfo.hasEnvVars ? '✅ OK' : '❌ Missing'}</p>
        <p>URL: {debugInfo.supabaseUrl}</p>
      </div>

      {/* CATEGORIES */}
      <div className="debug-box blue">
        <h3>Categories ({debugInfo.categories?.length || 0})</h3>

        {debugInfo.categories?.map((c: any) => (
          <p key={c.id}>- {c.name}</p>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="debug-box green">
        <h3>Products ({debugInfo.products?.length || 0})</h3>

        {debugInfo.products?.map((p: any) => (
          <p key={p.id}>- {p.name} ₹{p.price}</p>
        ))}
      </div>

      {/* JOIN */}
      <div className="debug-box yellow">
        <h3>Products + Categories</h3>

        {debugInfo.productsWithCategories?.map((p: any) => (
          <p key={p.id}>
            - {p.name} ({p.categories?.name || 'No Category'})
          </p>
        ))}
      </div>

      {debugInfo.error && (
        <div className="debug-box red">
          <h3>Error</h3>
          <p>{debugInfo.error}</p>
        </div>
      )}

    </div>
  );
}