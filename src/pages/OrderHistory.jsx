import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  FiPackage, 
  FiSearch, 
  FiChevronDown, 
  FiCalendar, 
  FiClock, 
  FiCreditCard, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiEye, 
  FiDownload, 
  FiRefreshCw
} from 'react-icons/fi';

// Sample order data
const orders = [
  {
    id: 'ORD-2025-4568',
    date: '2025-04-28',
    total: '$175.99',
    status: 'Delivered',
    items: [
      { name: 'Wireless Headphones', price: '$89.99', quantity: 1 },
      { name: 'Phone Charger', price: '$29.00', quantity: 2 },
      { name: 'Screen Protector', price: '$14.00', quantity: 2 },
    ],
    paymentMethod: 'Visa ending in 4321',
    shippingAddress: '123 Main Street, Anytown, USA',
    trackingNumber: 'TRK928374651'
  },
  {
    id: 'ORD-2025-4216',
    date: '2025-04-15',
    total: '$349.95',
    status: 'Shipped',
    items: [
      { name: 'Smart Watch', price: '$299.95', quantity: 1 },
      { name: 'Watch Band', price: '$25.00', quantity: 2 },
    ],
    paymentMethod: 'PayPal',
    shippingAddress: '123 Main Street, Anytown, USA',
    trackingNumber: 'TRK823741092'
  },
  {
    id: 'ORD-2025-3981',
    date: '2025-03-22',
    total: '$1,245.00',
    status: 'Delivered',
    items: [
      { name: 'Laptop', price: '$1,199.00', quantity: 1 },
      { name: 'Laptop Case', price: '$46.00', quantity: 1 },
    ],
    paymentMethod: 'Mastercard ending in 8765',
    shippingAddress: '123 Main Street, Anytown, USA',
    trackingNumber: 'TRK728394012'
  },
  {
    id: 'ORD-2025-3542',
    date: '2025-02-14',
    total: '$89.97',
    status: 'Cancelled',
    items: [
      { name: 'Wireless Mouse', price: '$29.99', quantity: 3 },
    ],
    paymentMethod: 'Visa ending in 4321',
    shippingAddress: '123 Main Street, Anytown, USA',
    trackingNumber: 'N/A'
  }
];

// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-700';
  let icon = <FiClock size={16} className="mr-1" />;
  
  if (status === 'Delivered') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
    icon = <FiCheckCircle size={16} className="mr-1" />;
  } else if (status === 'Shipped') {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
    icon = <FiTruck size={16} className="mr-1" />;
  } else if (status === 'Cancelled') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    icon = <FiXCircle size={16} className="mr-1" />;
  } else if (status === 'Processing') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    icon = <FiRefreshCw size={16} className="mr-1" />;
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {status}
    </span>
  );
};

const OrderHistory = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiPackage size={24} className="mr-2 text-indigo-600" />
              Your Order History
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Shipped">Shipped</option>
                <option value="Processing">Processing</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No orders found matching your criteria.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.id}</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar size={14} className="mr-1" />
                          {order.date}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <StatusBadge status={order.status} />
                      <div className="font-medium">{order.total}</div>
                      <FiChevronDown 
                        size={20} 
                        className={`text-gray-500 transition-transform ${expandedOrder === order.id ? 'transform rotate-180' : ''}`} 
                      />
                    </div>
                  </div>
                  
                  {expandedOrder === order.id && (
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-2">
                          <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-900">Order Total:</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">{order.total}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                        
                        <div>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                            <div>
                              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                                <FiCreditCard size={16} className="mr-2 text-gray-500" />
                                Payment Method
                              </h3>
                              <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                            </div>
                            
                            <div>
                              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                                <FiTruck size={16} className="mr-2 text-gray-500" />
                                Shipping Address
                              </h3>
                              <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                            </div>
                            
                            {order.trackingNumber !== 'N/A' && (
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                                  <FiPackage size={16} className="mr-2 text-gray-500" />
                                  Tracking Number
                                </h3>
                                <p className="text-sm text-gray-600">{order.trackingNumber}</p>
                              </div>
                            )}
                            
                            <div className="pt-4 flex gap-2">
                              <button className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                <FiEye size={16} className="mr-1" />
                                View Details
                              </button>
                              
                              {order.status !== 'Cancelled' && (
                                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                  <FiDownload size={16} className="mr-1" />
                                  Invoice
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {filteredOrders.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
              
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default OrderHistory;