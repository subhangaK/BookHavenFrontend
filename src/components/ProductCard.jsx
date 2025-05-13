import React, { createContext, useContext, useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Removed ToastContainer import

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

        const response = await axios.get("https://localhost:7189/api/Wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

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

const ProductCard = ({
  id,
  title,
  author,
  price,
  imagePath,
  isOnSale,
  discountPercentage,
  averageRating = 0,
  reviewCount = 0,
  discountedPrice
}) => {
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
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
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
              Accept: "*/*",
            },
          }
        );
        toggleFavorite(id);
        toast.success("Book added to wishlist successfully!");
      }
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
      // Calculate final price
      const finalPrice = isOnSale && discountedPrice !== null ? discountedPrice : price;
      if (isNaN(finalPrice) || finalPrice <= 0) {
        toast.error("Invalid price for this book.");
        return;
      }

      // Check if book is already in an order
      const orderResponse = await axios.get("https://localhost:7189/api/Order", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      if (!Array.isArray(orderResponse.data)) {
        console.error("Expected an array for orders, got:", orderResponse.data);
        toast.error("Failed to verify order status. Please try again.");
        return;
      }

      // Check if book ID exists in order items
      const isInOrder = orderResponse.data.some((order) =>
        order.orderItems?.some((item) => item.bookId === Number(id))
      );
      if (isInOrder) {
        toast.error("This book is already in an order and cannot be added to the cart.");
        return;
      }

      // Add to cart with final price
      await axios.post(
        "https://localhost:7189/api/Cart/add",
        { bookId: Number(id), quantity: 1, price: Number(finalPrice.toFixed(2)) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      toast.success("Book added to cart successfully!");
      setTimeout(() => navigate("/cart"), 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 404) {
        toast.error("Book not found.");
      } else if (error.response?.status === 400) {
        toast.error("Book already in cart or invalid request.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to add book to cart. Please try again.");
      }
    }
  };

  const navigateToDetails = () => {
    navigate(`/books/${id}`);
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={navigateToDetails}
    >
      {/* Wishlist Button */}
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

      {/* On Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          On Sale
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        {imagePath ? (
          <img
            src={`https://localhost:7189${imagePath}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-4">
        {/* Rating stars */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            {averageRating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        {/* Book Title */}
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{title}</h3>

        {/* Author */}
        <p className="text-sm text-gray-600 mb-3">by {author}</p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-2">
          {isOnSale && discountedPrice !== null ? (
            <>
              <span className="text-lg font-bold text-red-600">${discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-gray-500 line-through">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-800">${price.toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart Button */}
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