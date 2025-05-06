import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

  return (
    <FavoritesProvider>
      <div className="bg-gray-100 min-h-screen">
        <main className="container mx-auto py-8 px-4">
          <h2 className="text-2xl font-bold mb-6">Wishlist</h2>

          {isLoading && <p className="text-gray-600">Loading wishlist...</p>}

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {!isLoading && !error && wishlistBooks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
              <Link
                to="/"
                className="bg-indigo-500 text-white rounded py-2 px-4 hover:bg-indigo-600 transition"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wishlistBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white shadow-sm rounded overflow-hidden"
                >
                  <ProductCard
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    price={book.price}
                    image={book.imagePath || "/api/placeholder/240/160"}
                  />
                  <div className="p-4 pt-0">
                    <button
                      className="w-full bg-indigo-500 text-white rounded py-2 hover:bg-indigo-600 transition"
                      onClick={() => removeFromWishlist(book.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </FavoritesProvider>
  );
};

export default Wishlist;
