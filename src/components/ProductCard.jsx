import React, { createContext, useContext, useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
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

const ProductCard = ({ id, title, author, price, image }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleToggleFavorite = async () => {
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

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="font-bold mb-1">{title}</div>
        <div className="text-sm text-gray-600 mb-2">by {author}</div>
        <div className="flex justify-between items-center">
          <span className="font-bold">${price}</span>
          <FaHeart
            size={18}
            className={
              favorites.includes(id)
                ? "text-red-500 cursor-pointer"
                : "text-gray-300 cursor-pointer"
            }
            onClick={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
