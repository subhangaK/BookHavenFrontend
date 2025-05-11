import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaShoppingCart,
  FaTrashAlt,
  FaArrowLeft,
  FaHeart,
  FaLock,
  FaTruck,
} from "react-icons/fa";
import ProductCard, { FavoritesProvider } from "./ProductCard";

const Checkout = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your cart");
          setCartBooks([]);
          return;
        }

        const response = await axios.get("https://localhost:7189/api/Cart", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

        if (!Array.isArray(response.data)) {
          console.error("Expected an array, got:", response.data);
          setCartBooks([]);
          setError("Invalid cart data received");
          return;
        }

        setCartBooks(
          response.data.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            imagePath: book.imagePath,
            quantity: 1, // Default quantity
          }))
        );
      } catch (error) {
        console.error("Error fetching cart:", error);
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load cart. Please try again.");
        }
        setCartBooks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const removeFromCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to manage your cart");
        return;
      }

      await axios.delete(`https://localhost:7189/api/Cart/remove/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      setCartBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error removing from cart:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("Book not found in cart.");
      } else {
        setError("Failed to remove book from cart.");
      }
    }
  };

  const addToWishlist = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to manage your wishlist");
        return;
      }

      await axios.post(
        "https://localhost:7189/api/Wishlist/add",
        { bookId: bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      alert("Book added to wishlist successfully!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 400) {
        alert("Book already in wishlist.");
      } else {
        setError("Failed to add book to wishlist.");
      }
    }
  };

  const handleCheckout = async (book) => {
    if (!book) {
      alert("No item selected for checkout.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to place an order");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7189/api/Order/add",
        { bookId: book.id, quantity: book.quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      alert(`Book "${book.title}" added to order successfully!`);
      navigate("/order");
      // Remove from cart after successful checkout
      await removeFromCart(book.id);
    } catch (error) {
      console.error("Error adding to order:", error);
      if (error.response?.status === 404) {
        alert("Book not found.");
      } else if (error.response?.status === 400) {
        alert("Book already in order or invalid request.");
      } else if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to add book to order. Please try again.");
      }
    }
  };

  const subtotal = cartBooks.reduce(
    (sum, book) => sum + book.price * book.quantity,
    0
  );
  const totalPrice = subtotal.toFixed(2);
  const subtotalFormatted = subtotal.toFixed(2);

  return (
    <FavoritesProvider>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb navigation */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex text-sm">
              <Link to="/" className="text-gray-500 hover:text-indigo-600">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="font-medium text-gray-800">Shopping Cart</span>
            </nav>
          </div>
        </div>

        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaShoppingCart className="text-indigo-600 mr-3" size={24} />
              <h1 className="text-2xl font-bold text-gray-800">
                Your Shopping Cart
              </h1>
            </div>
            <Link
              to="/"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
              <span className="ml-3 text-gray-600 font-medium">
                Loading your cart...
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && cartBooks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <FaShoppingCart size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Looks like you haven't added any books to your cart yet. Start
                  shopping and find your next favorite read!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
                    <div className="border-b px-6 py-4">
                      <h2 className="font-semibold text-lg text-gray-800">
                        Cart Items ({cartBooks.length})
                      </h2>
                    </div>

                    {cartBooks.map((book) => (
                      <div key={book.id} className="border-b last:border-0">
                        <div className="p-6 flex flex-col sm:flex-row">
                          {/* Book image */}
                          <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
                            {book.imagePath ? (
                              <img
                                src={`https://localhost:7189${book.imagePath}`}
                                alt={book.title}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Book details */}
                          <div className="flex-grow sm:ml-6">
                            <div className="flex flex-col sm:flex-row justify-between">
                              <div>
                                <Link
                                  to={`/book/${book.id}`}
                                  className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                                >
                                  {book.title}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">
                                  by {book.author}
                                </p>
                                <p className="text-sm text-green-600 mt-1">
                                  In Stock
                                </p>
                              </div>
                              <div className="mt-4 sm:mt-0 text-right">
                                <div className="font-bold text-gray-900">
                                  ${book.price.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                              {/* Action buttons */}
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => addToWishlist(book.id)}
                                  className="text-sm text-gray-700 hover:text-indigo-600 flex items-center"
                                >
                                  <FaHeart className="mr-1" />
                                  Save for later
                                </button>
                                <button
                                  onClick={() => removeFromCart(book.id)}
                                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                >
                                  <FaTrashAlt className="mr-1" />
                                  Remove
                                </button>
                                <button
                                  onClick={() => handleCheckout(book)}
                                  className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
                                >
                                  <FaLock className="mr-1" />
                                  Checkout ($
                                  {(book.price * book.quantity).toFixed(2)})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden sticky top-6">
                    <div className="border-b px-6 py-4">
                      <h2 className="font-semibold text-lg text-gray-800">
                        Order Summary (All Items)
                      </h2>
                    </div>

                    <div className="p-6">
                      {/* Price breakdown */}
                      <div className="border-b pb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-800">
                            ${subtotalFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-gray-800">
                            Total
                          </span>
                          <span className="text-lg font-bold text-gray-800">
                            ${totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </FavoritesProvider>
  );
};

export default Checkout;
