import React, { createContext, useContext, useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setFavorites([]);

        const response = await axios.get("https://localhost:7189/api/Wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

        if (Array.isArray(response.data)) {
          const wishlistIds = response.data.map((book) => book.id);
          setFavorites(wishlistIds);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
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

const ProductCard = ({ id, title, author, price, imagePath, isOnSale, discountPercentage }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to manage your wishlist");
      navigate("/login");
      return;
    }

    try {
      if (favorites.includes(id)) {
        await axios.delete(`https://localhost:7189/api/Wishlist/remove/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toggleFavorite(id);
        toast.success("Book removed from wishlist successfully!");
      } else {
        await axios.post(
          "https://localhost:7189/api/Wishlist/add",
          { bookId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toggleFavorite(id);
        toast.success("Book added to wishlist successfully!");
      }
      toggleFavorite(id);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      if (error.response?.status === 404) {
        toast.error("Book not found or not in wishlist.");
      } else if (error.response?.status === 400) {
        toast.error("Book already in wishlist or invalid request.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to update wishlist. Please try again.");
      console.error("Wishlist update error:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Could not update wishlist.");
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      const orderResponse = await axios.get("https://localhost:7189/api/Order", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const isInOrder = Array.isArray(orderResponse.data) && orderResponse.data.some(order => order.id === id);
      if (isInOrder) {
        return alert("Book already in an order.");
      }

      await axios.post(
        "https://localhost:7189/api/Cart/add",
        { bookId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Book added to cart successfully!");
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 404) {
        toast.error("Book not found.");
      } else if (error.response?.status === 400) {
        toast.error("Book already in cart or invalid request.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Failed to add book to cart. Please try again.");
      }
    }
  };

  const discountedPrice = isOnSale
    ? (price * (1 - discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/books/${id}`)}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow z-10 hover:scale-110 transition"
        aria-label="Add to wishlist"
      >
        <FaHeart className={favorites.includes(id) ? "text-red-500" : "text-gray-300"} size={20} />
      </button>

      {/* On Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          On Sale
        </div>
      )}

      {/* Image */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        {imagePath ? (
          <img
            src={`https://localhost:7189${imagePath}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Rating Placeholder */}
        <div className="flex text-yellow-400 mb-2 items-center">
          {[...Array(4)].map((_, i) => (
            <FaStar key={i} />
          ))}
          <FaStar className="text-gray-300" />
          <span className="ml-1 text-xs text-gray-600">(4.0)</span>
        </div>

        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {author}</p>

        <div className="flex items-center justify-between mt-2">
          {isOnSale ? (
            <>
              <span className="text-lg font-bold text-red-600">${discountedPrice}</span>
              <span className="text-sm text-gray-500 line-through">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-800">${price.toFixed(2)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
        >
          <FaShoppingCart className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
