import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaShoppingCart,
  FaTrashAlt,
  FaStore,
  FaSadTear,
  FaHistory,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {
  const [orderBooks, setOrderBooks] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discountData, setDiscountData] = useState({
    purchaseDiscountPercentage: 0,
    totalOrders: 0,
    currentOrderBookCount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your order");
          setOrderBooks([]);
          setOrderHistory([]);
          navigate("/login");
          return;
        }

        // Fetch current orders
        const response = await axios.get(
          "https://localhost:7189/api/Order/with-discount",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        if (!response.data || !Array.isArray(response.data.orders)) {
          console.error("Expected an array in orders, got:", response.data);
          setError("Invalid order data received");
          setOrderBooks([]);
          return;
        }

        setDiscountData({
          purchaseDiscountPercentage:
            response.data.purchaseDiscountPercentage || 0,
          totalOrders: response.data.totalOrders || 0,
          currentOrderBookCount: response.data.currentOrderBookCount || 0,
        });

        // Filter out cancelled or purchased orders for the current order section
        setOrderBooks(
          response.data.orders
            .filter((order) => !order.isCancelled && !order.isPurchased)
            .map((order) => ({
              id: order.id, // Use order ID
              title: order.title,
              author: order.author,
              price: order.price,
              imagePath: order.imagePath,
              discountPercentage: order.discountPercentage || 0,
              claimCode: order.claimCode,
              dateAdded: order.dateAdded,
              quantity: order.quantity || 1,
            }))
        );

        // Set order history for cancelled or purchased orders
        setOrderHistory(
          response.data.orders
            .filter((order) => order.isCancelled || order.isPurchased)
            .map((order) => ({
              id: order.id, // Use order ID
              title: order.title,
              author: order.author,
              price: order.price,
              imagePath: order.imagePath,
              discountPercentage: order.discountPercentage || 0,
              claimCode: order.claimCode,
              dateAdded: order.dateAdded,
              isCancelled: order.isCancelled,
              isPurchased: order.isPurchased,
              quantity: order.quantity || 1,
            }))
        );
      } catch (error) {
        console.error("Error fetching order:", error);
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load order. Please try again.");
        }
        setOrderBooks([]);
        setOrderHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [navigate]);

  const removeFromOrder = async (orderId) => {
    toast.info("Removing book from order...", {
      autoClose: 2000,
      onClose: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Please log in to manage your order");
            navigate("/login");
            return;
          }

          // Use DELETE to remove the order
          await axios.delete(
            `https://localhost:7189/api/Order/remove/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
              },
            }
          );

          // Update orderBooks and orderHistory
          const orderToRemove = orderBooks.find((order) => order.id === orderId);
          if (!orderToRemove) {
            setError("Order not found in current order.");
            return;
          }

          // Remove order from orderBooks and add to orderHistory as cancelled
          setOrderBooks((prev) => prev.filter((order) => order.id !== orderId));
          setOrderHistory((prev) => [
            ...prev,
            {
              ...orderToRemove,
              isCancelled: true,
              quantity: orderToRemove.quantity, // Preserve quantity
            },
          ]);
          toast.success("Book removed from order successfully!");
        } catch (error) {
          console.error("Error removing from order:", error);
          if (error.response?.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/login");
          } else if (error.response?.status === 404) {
            setError("Order not found.");
          } else if (error.response?.status === 400) {
            setError(
              error.response.data?.message || "Order cannot be removed."
            );
          } else {
            setError("Failed to remove book from order. Please try again.");
          }
          toast.error(error.response?.data?.message || "Failed to remove book.");
        }
      },
    });
  };

  const cancelOrder = async (orderId) => {
    toast.info("Cancelling order...", {
      autoClose: 2000,
      onClose: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Please log in to manage your order");
            navigate("/login");
            return;
          }

          // Use PATCH to cancel the order
          const response = await axios.patch(
            `https://localhost:7189/api/Order/cancel/${orderId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
              },
            }
          );

          // Update orderBooks and orderHistory
          const orderToCancel = orderBooks.find((order) => order.id === orderId);
          if (!orderToCancel) {
            setError("Order not found in current order.");
            return;
          }

          if (response.data.quantity > 0) {
            // Update quantity if still greater than 0
            setOrderBooks((prev) =>
              prev.map((order) =>
                order.id === orderId
                  ? { ...order, quantity: response.data.quantity }
                  : order
              )
            );
          } else {
            // Remove order from orderBooks and add to orderHistory if fully cancelled
            setOrderBooks((prev) => prev.filter((order) => order.id !== orderId));
            setOrderHistory((prev) => [
              ...prev,
              {
                ...orderToCancel,
                isCancelled: true,
                quantity: 0, // Set quantity to 0 for fully cancelled
              },
            ]);
          }
          toast.success("Order cancelled successfully!");
        } catch (error) {
          console.error("Error cancelling order:", error);
          if (error.response?.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/login");
          } else if (error.response?.status === 404) {
            setError("Order not found.");
          } else if (error.response?.status === 400) {
            setError(
              error.response.data?.message ||
                "Order is already cancelled or cannot be modified."
            );
          } else {
            setError("Failed to cancel order. Please try again.");
          }
          toast.error(error.response?.data?.message || "Failed to cancel order.");
        }
      },
    });
  };

  // Calculate total price for order history
  const orderHistoryTotal = orderHistory.reduce(
    (sum, order) =>
      sum + order.price * order.quantity * (1 - order.discountPercentage),
    0
  );
  const orderHistoryTotalFormatted = orderHistoryTotal.toFixed(2);

  return (
    <div className="min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
      <main className="container mx-9 max-w-screen-xl py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FaShoppingCart className="text-indigo-600 mr-3" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">My Order</h1>
          </div>
          <Link
            to="/ProductPage"
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <FaStore className="mr-2" />
            Browse Books
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <span className="ml-3 text-gray-600 font-medium">
              Loading your order...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400"
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
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading &&
        !error &&
        orderBooks.length === 0 &&
        orderHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <FaSadTear size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Your order is empty
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                You haven't added any books to your order yet. Browse our
                collection and add your favorites!
              </p>
              <Link
                to="/books"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaStore className="mr-2" />
                Browse Books
              </Link>
            </div>
          </div>
        ) : (
          <>
            {!isLoading && !error && orderBooks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    <span className="font-medium">{orderBooks.length}</span>{" "}
                    {orderBooks.length === 1 ? "item" : "items"} in your order
                  </span>
                  <Link
                    to="/books"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}

            {orderBooks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orderBooks.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {order.imagePath ? (
                        <img
                          src={`https://localhost:7189${order.imagePath}`}
                          alt={order.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-200">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:bg-red-50 transition-colors"
                        title="Cancel order"
                      >
                        <FaTrashAlt className="text-red-500" size={16} />
                      </button>
                      {order.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
                          {(order.discountPercentage * 100).toFixed(0)}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <Link to={`/books/${order.id}`} className="block">
                        <h3 className="font-medium text-gray-900 mb-1 hover:text-indigo-600 transition-colors line-clamp-1">
                          {order.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-1">
                        by {order.author}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Claim Code: {order.claimCode}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Quantity: {order.quantity}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        Ordered on:{" "}
                        {new Date(order.dateAdded).toLocaleDateString()}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-baseline">
                          {order.discountPercentage > 0 ? (
                            <>
                              <span className="text-lg font-bold text-gray-900">
                                $
                                {(
                                  order.price *
                                  order.quantity *
                                  (1 - order.discountPercentage)
                                ).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${(order.price * order.quantity).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              ${(order.price * order.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Order History Section */}
            {!isLoading && !error && orderHistory.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <FaHistory className="text-indigo-600 mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Order History
                    </h2>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    Total: ${orderHistoryTotalFormatted}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {order.imagePath ? (
                          <img
                            src={`https://localhost:7189${order.imagePath}`}
                            alt={order.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-gray-200">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        {order.isCancelled && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                            Cancelled
                          </div>
                        )}
                        {order.isPurchased && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
                            Purchased
                          </div>
                        )}
                        {order.discountPercentage > 0 && (
                          <div className="absolute top-2 left-2 mt-8 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
                            {(order.discountPercentage * 100).toFixed(0)}% OFF
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <Link to={`/books/${order.id}`} className="block">
                          <h3 className="font-medium text-gray-900 mb-1 hover:text-indigo-600 transition-colors line-clamp-1">
                            {order.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mb-1">
                          by {order.author}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          Claim Code: {order.claimCode}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          Quantity: {order.quantity}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          Ordered on:{" "}
                          {new Date(order.dateAdded).toLocaleDateString()}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-baseline">
                            {order.discountPercentage > 0 ? (
                              <>
                                <span className="text-lg font-bold text-gray-900">
                                  $
                                  {(
                                    order.price *
                                    order.quantity *
                                    (1 - order.discountPercentage)
                                  ).toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ${(order.price * order.quantity).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                ${(order.price * order.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Order;