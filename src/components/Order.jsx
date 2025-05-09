import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaTrashAlt, FaStore, FaSadTear } from "react-icons/fa";

const Order = () => {
  const [orderBooks, setOrderBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discountData, setDiscountData] = useState({
    discountPercentage: 0,
    totalOrders: 0,
    currentOrderBookCount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your order");
          setOrderBooks([]);
          navigate("/login"); // Redirect to login
          return;
        }

        const response = await axios.get("https://localhost:7189/api/Order/with-discount", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

        // Validate response structure
        if (!response.data || !Array.isArray(response.data.orders)) {
          console.error("Expected an array in orders, got:", response.data);
          setError("Invalid order data received");
          setOrderBooks([]);
          return;
        }

        // Set discount data
        setDiscountData({
          discountPercentage: response.data.discountPercentage || 0,
          totalOrders: response.data.totalOrders || 0,
          currentOrderBookCount: response.data.currentOrderBookCount || 0,
        });

        // Map orders to state
        setOrderBooks(
          response.data.orders.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            imagePath: book.imagePath,
            discountPercentage: book.discountPercentage || 0,
            claimCode: book.claimCode,
            dateAdded: book.dateAdded,
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, []); // Removed navigate from dependencies

  const removeFromOrder = async (bookId) => {
    if (!window.confirm("Are you sure you want to remove this book from your order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to manage your order");
        navigate("/login");
        return;
      }

      await axios.delete(`https://localhost:7189/api/Order/remove/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      setOrderBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error removing from order:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("Book not found in order.");
      } else {
        setError("Failed to remove book from order.");
      }
    }
  };

  const addToOrder = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to add items to your order");
        navigate("/login");
        return;
      }

      await axios.post(
        "https://localhost:7189/api/Order/add",
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      // Refetch order data to update discounts
      const response = await axios.get("https://localhost:7189/api/Order/with-discount", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      setDiscountData({
        discountPercentage: response.data.discountPercentage || 0,
        totalOrders: response.data.totalOrders || 0,
        currentOrderBookCount: response.data.currentOrderBookCount || 0,
      });

      setOrderBooks(
        response.data.orders.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          imagePath: book.imagePath,
          discountPercentage: book.discountPercentage || 0,
          claimCode: book.claimCode,
          dateAdded: book.dateAdded,
        }))
      );

      alert("Book added to order successfully!");
    } catch (error) {
      console.error("Error adding to order:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 400) {
        setError("Book already in order or invalid request.");
      } else {
        setError("Failed to add book to order. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FaShoppingCart className="text-indigo-600 mr-3" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">My Order</h1>
          </div>
          <Link
            to="/books"
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <FaStore className="mr-2" />
            Browse Books
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading your order...</span>
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

        {!isLoading && !error && orderBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <FaSadTear size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your order is empty</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                You haven't added any books to your order yet. Browse our collection and add your favorites!
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orderBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {book.imagePath ? (
                      <img
                        src={`https://localhost:7189${book.imagePath}`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-200">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFromOrder(book.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:bg-red-50 transition-colors"
                      title="Remove from order"
                    >
                      <FaTrashAlt className="text-red-500" size={16} />
                    </button>
                    {book.discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
                        {book.discountPercentage * 100}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <Link to={`/book/${book.id}`} className="block">
                      <h3 className="font-medium text-gray-900 mb-1 hover:text-indigo-600 transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-1">by {book.author}</p>
                    <p className="text-sm text-gray-500 mb-1">Claim Code: {book.claimCode}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      Ordered on: {new Date(book.dateAdded).toLocaleDateString()}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline">
                        {book.discountPercentage > 0 ? (
                          <>
                            <span className="text-lg font-bold text-gray-900">
                              ${(book.price * (1 - book.discountPercentage)).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${book.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${book.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Order;