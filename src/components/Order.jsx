import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiPackage,
  FiSearch,
  FiChevronDown,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { FavoritesProvider } from "./ProductCard";

// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let icon = <FiRefreshCw size={16} className="mr-1" />;

  if (status === "Delivered") {
    bgColor = "bg-green-100";
    textColor = "text-green-700";
    icon = <FiCheckCircle size={16} className="mr-1" />;
  } else if (status === "Shipped") {
    bgColor = "bg-blue-100";
    textColor = "text-blue-700";
    icon = <FiRefreshCw size={16} className="mr-1" />;
  } else if (status === "Cancelled") {
    bgColor = "bg-red-100";
    textColor = "text-red-700";
    icon = <FiXCircle size={16} className="mr-1" />;
  } else if (status === "Processing") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-700";
    icon = <FiRefreshCw size={16} className="mr-1" />;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} transition-all duration-300`}
    >
      {icon}
      {status}
    </span>
  );
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your order history");
          setOrders([]);
          return;
        }

        const response = await axios.get("https://localhost:7189/api/Order", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

        if (!Array.isArray(response.data)) {
          console.error("Expected an array, got:", response.data);
          setOrders([]);
          setError("Invalid order data received");
          return;
        }

        const groupedOrders = response.data.reduce((acc, book) => {
          const orderId = book.orderId || `ORD-${book.id}`;
          if (!acc[orderId]) {
            acc[orderId] = {
              id: orderId,
              date: book.orderDate || new Date().toISOString().split("T")[0],
              total: 0,
              status: book.isCancelled ? "Cancelled" : "Processing",
              items: [],
              paymentMethod: "Cash",
              trackingNumber: book.trackingNumber || "N/A",
            };
          }
          acc[orderId].items.push({
            id: book.id,
            name: book.title,
            price: `$${book.price.toFixed(2)}`,
            quantity: book.quantity || 1, // Use quantity from backend
          });
          acc[orderId].total += book.price * (book.quantity || 1);
          return acc;
        }, {});

        const formattedOrders = Object.values(groupedOrders).map((order) => ({
          ...order,
          total: `$${order.total.toFixed(2)}`,
        }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load order history. Please try again.");
        }
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const cancelOrder = async (bookId) => {
    if (!window.confirm("Are you sure you want to cancel this book order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to manage your order");
        return;
      }

      // Send cancellation request
      await axios.patch(
        `https://localhost:7189/api/Order/cancel/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      // Re-fetch orders to get updated data
      const response = await axios.get("https://localhost:7189/api/Order", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      if (!Array.isArray(response.data)) {
        console.error("Expected an array, got:", response.data);
        setOrders([]);
        setError("Invalid order data received");
        return;
      }

      const groupedOrders = response.data.reduce((acc, book) => {
        const orderId = book.orderId || `ORD-${book.id}`;
        if (!acc[orderId]) {
          acc[orderId] = {
            id: orderId,
            date: book.orderDate || new Date().toISOString().split("T")[0],
            total: 0,
            status: book.isCancelled ? "Cancelled" : "Processing",
            items: [],
            paymentMethod: "Cash",
            trackingNumber: book.trackingNumber || "N/A",
          };
        }
        acc[orderId].items.push({
          id: book.id,
          name: book.title,
          price: `$${book.price.toFixed(2)}`,
          quantity: book.quantity || 1,
        });
        acc[orderId].total += book.price * (book.quantity || 1);
        return acc;
      }, {});

      const formattedOrders = Object.values(groupedOrders).map((order) => ({
        ...order,
        total: `$${order.total.toFixed(2)}`,
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error cancelling order:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("Book not found in order.");
      } else if (error.response?.status === 400) {
        setError("Order is already cancelled.");
      } else {
        setError("Failed to cancel order.");
      }
    }
  };

  const restoreOrder = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to manage your order");
        return;
      }

      await axios.patch(
        `https://localhost:7189/api/Order/restore/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      // Re-fetch orders to get updated data
      const response = await axios.get("https://localhost:7189/api/Order", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      if (!Array.isArray(response.data)) {
        console.error("Expected an array, got:", response.data);
        setOrders([]);
        setError("Invalid order data received");
        return;
      }

      const groupedOrders = response.data.reduce((acc, book) => {
        const orderId = book.orderId || `ORD-${book.id}`;
        if (!acc[orderId]) {
          acc[orderId] = {
            id: orderId,
            date: book.orderDate || new Date().toISOString().split("T")[0],
            total: 0,
            status: book.isCancelled ? "Cancelled" : "Processing",
            items: [],
            paymentMethod: "Cash",
            trackingNumber: book.trackingNumber || "N/A",
          };
        }
        acc[orderId].items.push({
          id: book.id,
          name: book.title,
          price: `$${book.price.toFixed(2)}`,
          quantity: book.quantity || 1,
        });
        acc[orderId].total += book.price * (book.quantity || 1);
        return acc;
      }, {});

      const formattedOrders = Object.values(groupedOrders).map((order) => ({
        ...order,
        total: `$${order.total.toFixed(2)}`,
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error restoring order:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("Book not found in order.");
      } else {
        setError("Failed to restore order.");
      }
    }
  };

  const updateQuantity = async (bookId, orderId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to manage your order");
        return;
      }

      // Optimistic update
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              items: order.items.map((item) =>
                item.id === bookId ? { ...item, quantity: newQuantity } : item
              ),
              total: `$${order.items
                .reduce((sum, item) => {
                  const price = parseFloat(item.price.replace("$", ""));
                  const qty = item.id === bookId ? newQuantity : item.quantity;
                  return sum + price * qty;
                }, 0)
                .toFixed(2)}`,
            };
          }
          return order;
        })
      );

      // Send API request
      await axios.patch(
        `https://localhost:7189/api/Order/update-quantity/${bookId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("Order not found.");
      } else if (error.response?.status === 400) {
        setError("Invalid quantity or order is cancelled.");
      } else {
        setError("Failed to update quantity.");
      }

      // Revert optimistic update
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              items: order.items.map((item) =>
                item.id === bookId ? { ...item, quantity: item.quantity } : item
              ),
              total: `$${order.items
                .reduce((sum, item) => {
                  const price = parseFloat(item.price.replace("$", ""));
                  return sum + price * item.quantity;
                }, 0)
                .toFixed(2)}`,
            };
          }
          return order;
        })
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <FavoritesProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiPackage size={28} className="mr-3 text-indigo-600" />
                Your Order History
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch
                    size={20}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                </div>
                <select
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-700"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                <span className="ml-4 text-gray-600 font-medium text-lg">
                  Loading your order history...
                </span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-3 text-base font-medium text-red-800">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !error && filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <FiPackage size={56} className="mx-auto text-gray-300 mb-6" />
                <p className="text-gray-500 text-lg">
                  No orders found matching your criteria.
                </p>
                <Link
                  to="/books"
                  className="inline-flex items-center mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Browse Books
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div
                      className="flex items-center justify-between p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 text-lg">
                            {order.id}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar size={16} className="mr-1.5" />
                            {order.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <StatusBadge status={order.status} />
                        <div className="font-semibold text-gray-900 text-lg">
                          {order.total}
                        </div>
                        <FiChevronDown
                          size={24}
                          className={`text-gray-500 transition-transform duration-300 ${
                            expandedOrder === order.id
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="p-6 border-t border-gray-200 bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="col-span-2">
                            <h3 className="font-semibold text-gray-900 text-xl mb-4">
                              Order Items
                            </h3>
                            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      Book
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      Quantity
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {order.items.map((item) => (
                                    <tr
                                      key={item.id}
                                      className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <Link
                                          to={`/book/${item.id}`}
                                          className="hover:text-indigo-600 transition-colors duration-200"
                                        >
                                          {item.name}
                                        </Link>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {item.price}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() =>
                                              updateQuantity(
                                                item.id,
                                                order.id,
                                                item.quantity - 1
                                              )
                                            }
                                            disabled={
                                              item.quantity <= 1 ||
                                              order.status === "Cancelled"
                                            }
                                            aria-label={`Decrease quantity of ${item.name}`}
                                            className={`px-2 py-1 rounded bg-gray-200 text-gray-600 ${
                                              item.quantity <= 1 ||
                                              order.status === "Cancelled"
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-300"
                                            }`}
                                          >
                                            −
                                          </button>
                                          <span>{item.quantity}</span>
                                          <button
                                            onClick={() =>
                                              updateQuantity(
                                                item.id,
                                                order.id,
                                                item.quantity + 1
                                              )
                                            }
                                            disabled={
                                              order.status === "Cancelled"
                                            }
                                            aria-label={`Increase quantity of ${item.name}`}
                                            className={`px-2 py-1 rounded bg-gray-200 text-gray-600 ${
                                              order.status === "Cancelled"
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-300"
                                            }`}
                                          >
                                            +
                                          </button>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        $
                                        {(
                                          parseFloat(
                                            item.price.replace("$", "")
                                          ) * item.quantity
                                        ).toFixed(2)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {order.status !== "Cancelled" ? (
                                          <button
                                            onClick={() => cancelOrder(item.id)}
                                            className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                                          >
                                            Cancel
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              restoreOrder(item.id)
                                            }
                                            className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
                                          >
                                            Restore
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="px-6 py-4 text-right text-sm font-semibold text-gray-900"
                                    >
                                      Order Total:
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                      {order.total}
                                    </td>
                                    <td></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                          <div>
                            <div className="bg-gray-50 p-6 rounded-xl space-y-6 shadow-sm mt-20">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-2 flex items-center">
                                  <FiCreditCard
                                    size={18}
                                    className="mr-2 text-gray-500"
                                  />
                                  Payment Method
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {order.paymentMethod}
                                </p>
                              </div>
                              {order.trackingNumber !== "N/A" && (
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg mb-2 flex items-center">
                                    <FiPackage
                                      size={18}
                                      className="mr-2 text-gray-500"
                                    />
                                    Tracking Number
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {order.trackingNumber}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && filteredOrders.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
                <div className="flex items-center space-x-3">
                  <button className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow">
                    Previous
                  </button>
                  <button className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </FavoritesProvider>
  );
};

export default Order;
