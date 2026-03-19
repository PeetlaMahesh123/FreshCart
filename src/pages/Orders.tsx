import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string | null;
    unit: string;
  } | null;
}

interface Order {
  id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  phone: string;
  created_at: string;
  items: OrderItem[];
}

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (
            id,
            quantity,
            price,
            product:products (
              name,
              image_url,
              unit
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(ordersData as unknown as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <Package className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600">Your orders will appear here once you make a purchase</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order ID: <span className="font-mono font-semibold text-gray-900">{order.id.slice(0, 8)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                    <span className="text-lg font-bold text-gray-900">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.product?.image_url || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={item.product?.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product?.name || 'Product'}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} {item.product?.unit} × ₹{item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">{order.shipping_address}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                    </div>
                  </div>
                </div>

                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className={`flex flex-col items-center ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <span className="text-xs mt-1">Confirmed</span>
                          </div>
                          <div className={`flex-1 h-1 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                          <div className={`flex flex-col items-center ${order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                              <Truck className="h-5 w-5" />
                            </div>
                            <span className="text-xs mt-1">Shipped</span>
                          </div>
                          <div className={`flex-1 h-1 ${order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                          <div className={`flex flex-col items-center ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                              <Package className="h-5 w-5" />
                            </div>
                            <span className="text-xs mt-1">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
