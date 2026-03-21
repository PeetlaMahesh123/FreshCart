import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2 } from 'lucide-react';
import '../../styles/pages/AdminProducts.css';

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: productData, error: pError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: categoryData, error: cError } = await supabase
      .from('categories')
      .select('id, name');

    if (pError) console.error(pError);
    if (cError) console.error(cError);

    setProducts(productData || []);
    setCategories(categoryData || []);
    setLoading(false);
  };

  // 🔥 ✅ FIXED DELETE FUNCTION
  const handleDelete = async (id: string) => {
    if (!confirm('Delete product?')) return;

    try {
      // 🔴 Step 1: delete from cart_items
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('product_id', id);

      if (cartError) {
        console.error(cartError);
        alert("❌ Failed to delete from cart_items");
        return;
      }

      // 🔴 Step 2: delete from order_items
      const { error: orderError } = await supabase
        .from('order_items')
        .delete()
        .eq('product_id', id);

      if (orderError) {
        console.error(orderError);
        alert("❌ Failed to delete from order_items");
        return;
      }

      // 🟢 Step 3: delete from products
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (productError) {
        console.error(productError);
        alert("❌ Failed to delete product");
        return;
      }

      alert("✅ Product deleted successfully");

      // 🔄 Refresh data
      fetchData();

    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // 🔹 Submit (Add / Update)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (isAdding) {
        const { error } = await supabase
          .from('products')
          .insert([editingProduct]);

        if (error) throw error;

      } else {
        const { error } = await supabase
          .from('products')
          .update(editingProduct)
          .eq('id', editingProduct.id);

        if (error) throw error;
      }

      alert("✅ Saved successfully");

      setEditingProduct(null);
      setIsAdding(false);
      fetchData();

    } catch (err) {
      console.error(err);
      alert("❌ Error saving product");
    }
  };

  return (
    <div className="admin-products-container">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Products</h1>

        <button
          className="add-btn"
          onClick={() => {
            setIsAdding(true);
            setEditingProduct({
              name: '',
              price: 0,
              stock: 0,
              image_url: '',
              category_id: '',
              unit: 'kg',
              ratings: 4,
              is_active: true,
            });
          }}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* TABLE */}
      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={p.image_url || "https://via.placeholder.com/80"}
                    alt={p.name}
                    className="table-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/80";
                    }}
                  />
                </td>

                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>

                <td className="actions">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setIsAdding(false);
                    }}
                  >
                    <Edit size={16} />
                  </button>

                  <button onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM */}
      {editingProduct && (
        <form onSubmit={handleSubmit} className="product-form">

          <h2>{isAdding ? "Add Product" : "Edit Product"}</h2>

          <img
            src={editingProduct.image_url || "https://via.placeholder.com/100"}
            className="preview-img"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/100";
            }}
          />

          <input
            placeholder="Product Name"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
            }
          />

          <input
            type="number"
            placeholder="Stock"
            value={editingProduct.stock}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
            }
          />

          <input
            placeholder="Image URL"
            value={editingProduct.image_url}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, image_url: e.target.value })
            }
          />

          <select
            value={editingProduct.category_id}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, category_id: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button type="submit" className="submit-btn">
            {isAdding ? "Add Product" : "Update Product"}
          </button>

        </form>
      )}

    </div>
  );
}