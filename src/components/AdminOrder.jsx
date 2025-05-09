import { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBox, FaCheckCircle, FaTimes, FaExclamationTriangle, FaCalendarAlt, FaDollarSign, FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

export default function AdminOrderPage() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [purchaseCode, setPurchaseCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || token || 'your-postman-token-here'; // Fallback for testing
    console.log("Using token:", storedToken);
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      if (!token && !localStorage.getItem('token')) {
        throw new Error('No token found. Please log in.');
      }

      const response = await axios.get('https://localhost:7189/api/Order/all', {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
      });
      console.log("API Response Status:", response.status);
      console.log("API Response:", response.data);
      const fetchedOrders = Array.isArray(response.data) ? response.data : [];
      setOrders(fetchedOrders);
      console.log("Orders state set:", fetchedOrders);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Orders Error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage === 'Admin role required to access this endpoint'
        ? 'Access denied: Admin role required. Please log in with an Admin account.'
        : 'Failed to fetch orders: ' + (err.response?.statusText || err.message));
      setLoading(false);
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    console.log("Search Term:", e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    console.log("Search Term Cleared");
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    const idStr = order.id ? order.id.toString().toLowerCase() : '';
    const customerStr = order.customer ? order.customer.toLowerCase() : '';
    const term = searchTerm.toLowerCase();
    const matches = idStr.includes(term) || customerStr.includes(term);
    console.log(`Order ${order.id} matches search:`, matches);
    return matches;
  });

  const selectOrder = (order) => {
    setSelectedOrder(order);
    setPurchaseCode('');
    console.log("Selected Order:", order);
  };

  const handlePurchaseCodeSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!selectedOrder) {
      toast.error('No order selected', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      if (!token && !localStorage.getItem('token')) throw new Error('No token available');

      const response = await axios.post(
        'https://localhost:7189/api/order/approve',
        { claimCode: purchaseCode },
        { headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` } }
      );
      console.log("Approve Response:", response.data);

      const updatedOrders = orders.map(order =>
        order.claimCode === purchaseCode ? { ...order, status: 'purchased' } : order
      );
      setOrders(updatedOrders);
      setSelectedOrder({ ...selectedOrder, status: 'purchased' });
      toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      console.error("Approve Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to verify claim code', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center">
        <div className="bg-white p-6 rounded shadow text-red-600">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  console.log("Filtered Orders:", filteredOrders);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <FaBox className="mr-2" size={24} /> Admin Order Management
          </h1>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto flex flex-col md:flex-row flex-grow p-4 gap-4">
        {/* Order List Section */}
        <div className="w-full md:w-1/2 bg-white rounded shadow p-4">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FaShoppingCart className="mr-2" size={20} /> Orders
            </h2>
            <div className="ml-auto flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-8 pr-4 py-2 border rounded"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-2 top-2 text-gray-400" size={16} />
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-gray-500 hover:text-gray-700"
                  title="Clear Search"
                >
                  <FaTimes size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-96">
            {filteredOrders.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <li 
                    key={order.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedOrder?.id === order.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                    onClick={() => selectOrder(order)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{order.id || 'N/A'}</span>
                        <p className="text-sm text-gray-600">{order.customer || 'Unknown'}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-700">${order.total ? order.total.toFixed(2) : '0.00'}</span>
                        {order.status === 'purchased' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                            <FaCheckCircle size={12} className="mr-1" /> Purchased
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
                            <FaExclamationTriangle size={12} className="mr-1" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaBox size={48} className="mx-auto mb-2 opacity-30" />
                <p>No orders found matching your search.</p>
                {orders.length === 0 && (
                  <p className="mt-2">
                    It looks like there are no orders in the database. Try adding an order as a user first.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Order Details Section */}
        <div className="w-full md:w-1/2 bg-white rounded shadow p-4">
          {selectedOrder ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-semibold">Order Details</h2>
                <div className="flex items-center space-x-2">
                  {selectedOrder.status === 'purchased' ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center">
                      <FaCheckCircle size={14} className="mr-1" /> Purchased
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 flex items-center">
                      <FaExclamationTriangle size={14} className="mr-1" /> Pending
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <FaBox size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{selectedOrder.id || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <FaCalendarAlt size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{selectedOrder.date || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <FaUserCircle size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.customer || 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <FaDollarSign size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">${selectedOrder.total ? selectedOrder.total.toFixed(2) : '0.00'}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="bg-gray-50 rounded p-3 mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="py-2">{item.name || 'Unknown Item'}</td>
                        <td className="py-2 text-center">{item.quantity || 0}</td>
                        <td className="py-2 text-right">${item.price ? item.price.toFixed(2) : '0.00'}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 font-medium">
                      <td colSpan="2" className="py-2">Total</td>
                      <td className="py-2 text-right">${selectedOrder.total ? selectedOrder.total.toFixed(2) : '0.00'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {selectedOrder.status === 'pending' && (
                <div>
                  <h3 className="font-medium mb-2">Mark as Purchased</h3>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow border rounded-l px-4 py-2"
                      placeholder="Enter purchase code"
                      value={purchaseCode}
                      onChange={(e) => setPurchaseCode(e.target.value)}
                    />
                    <button
                      onClick={handlePurchaseCodeSubmit}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700"
                    >
                      Verify
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the correct purchase code to mark this order as purchased
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FaBox size={48} className="mx-auto mb-2 opacity-30" />
                <p>Select an order to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}