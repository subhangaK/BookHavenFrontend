import React, { createContext, useContext, useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setFavorites([]);
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
          setFavorites([]);
          return;
        }

        const wishlistIds = response.data.map((book) => book.id);
        setFavorites(wishlistIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

const ProductCard = ({ id, title, author, price, imagePath }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to manage your wishlist");
      navigate("/login");
      return;
    }

    try {
      if (favorites.includes(id)) {
        await axios.delete(`https://localhost:7189/api/Wishlist/remove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });
        toggleFavorite(id);
      } else {
        await axios.post(
          "https://localhost:7189/api/Wishlist/add",
          { bookId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "*/*",
            },
          }
        );
        toggleFavorite(id);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      if (error.response?.status === 404) {
        alert("Book not found or not in wishlist.");
      } else if (error.response?.status === 400) {
        alert("Book already in wishlist or invalid request.");
      } else if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to update wishlist. Please try again.");
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7189/api/Cart/add",
        { bookId: id },
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
      if (error.response?.status === 404) {
        alert("Book not found.");
      } else if (error.response?.status === 400) {
        alert("Book already in cart or invalid request.");
      } else if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to add book to cart. Please try again.");
      }
    }
  };

  const handleAddToOrder = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to your order");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7189/api/Order/add",
        { bookId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      alert("Book added to order successfully!");
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

  const navigateToDetails = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={navigateToDetails}
    >
      {/* Wishlist Button - Absolutely positioned */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm z-10 transition-all hover:scale-110"
        aria-label="Add to wishlist"
      >
        <FaHeart
          size={20}
          className={favorites.includes(id) ? "text-red-500" : "text-gray-300"}
        />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        {imagePath ? (
          <img
            src={`https://localhost:7189${imagePath}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-4">
        {/* Rating stars - For decorative purposes */}
        <div className="flex text-yellow-400 mb-2">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar className="text-gray-300" />
          <span className="ml-1 text-xs text-gray-600">(4.0)</span>
        </div>

        {/* Book Title */}
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
          {title}
        </h3>

        {/* Author */}
        <p className="text-sm text-gray-600 mb-3">by {author}</p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-gray-800">${price}</span>
            <span className="text-sm text-gray-500 line-through ml-2">
              ${(price * 1.2).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
        >
          <FaShoppingCart className="mr-2" />
          Add to Cart
        </button>

        {/* Add to Order Button */}
        <button
          onClick={handleAddToOrder}
          className="mt-2 w-full border-1 border-indigo-600 text-black py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-center"
        >
          <FaShoppingCart className="mr-2" />
          Place Order
        </button>
      </div>
    </div>
  );
};

export default ProductCard;