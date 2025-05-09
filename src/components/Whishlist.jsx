import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaShoppingCart,
  FaTrashAlt,
  FaStore,
  FaSadTear,
} from "react-icons/fa";
import ProductCard, { FavoritesProvider } from "./ProductCard";

const Wishlist = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your wishlist");
          setWishlistBooks([]);
          return;
        }

        const response = await axios.get(
          "https://localhost:7189/api/Wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        if (!Array.isArray(response.data)) {
          console.error("Expected an array, got:", response.data);
          setWishlistBooks([]);
          setError("Invalid wishlist data received");
          return;
        }

        setWishlistBooks(
          response.data.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            imagePath: book.imagePath,
          }))
        );
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setError("Failed to load wishlist. Please try again.");
        }
        setWishlistBooks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (bookId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this book from your wishlist?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to manage your wishlist");
        return;
      }

      await axios.delete(
        `https://localhost:7189/api/Wishlist/remove/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );
      setWishlistBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
      } else if (error.response?.status === 404) {
        setError("Book not found in wishlist.");
      } else {
        setError("Failed to remove book from wishlist.");
      }
    }
  };

  const addToCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to add items to your cart");
        return;
      }

      await axios.post(
        "https://localhost:7189/api/Cart/add",
        { bookId: bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      alert("Book added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
      } else if (error.response?.status === 400) {
        setError("Book already in cart or invalid request.");
      } else {
        setError("Failed to add book to cart. Please try again.");
      }
    }
  };

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaHeart className="text-red-500 mr-3" size={24} />
              <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
            </div>
            <Link
              to="/cart"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <FaShoppingCart className="mr-2" />
              View Cart
            </Link>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
              <span className="ml-3 text-gray-600 font-medium">
                Loading your wishlist...
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
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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

          {!isLoading && !error && wishlistBooks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <FaSadTear size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  You haven't added any books to your wishlist yet. Browse our
                  collection and add your favorites!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaStore className="mr-2" />
                  Browse Books
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Wishlist items count summary */}
              {!isLoading && !error && wishlistBooks.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      <span className="font-medium">
                        {wishlistBooks.length}
                      </span>{" "}
                      {wishlistBooks.length === 1 ? "item" : "items"} in your
                      wishlist
                    </span>
                    <Link
                      to="/"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              )}

              {/* Wishlist grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden"
                  >
                    {/* Book image */}
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
                        onClick={() => removeFromWishlist(book.id)}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:bg-red-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <FaTrashAlt className="text-red-500" size={16} />
                      </button>
                    </div>

                    {/* Book info */}
                    <div className="p-4">
                      <Link to={`/book/${book.id}`} className="block">
                        <h3 className="font-medium text-gray-900 mb-1 hover:text-indigo-600 transition-colors line-clamp-1">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-3">
                        by {book.author}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-baseline">
                          <span className="text-lg font-bold text-gray-900">
                            ${book.price}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(book.id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center justify-center transition-colors"
                      >
                        <FaShoppingCart className="mr-2" size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </FavoritesProvider>
  );
};

export default Wishlist;
