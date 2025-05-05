import React, { createContext, useContext, useState } from 'react';
import { FaHeart } from 'react-icons/fa';

// Create Context for managing favorites
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

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

// ProductCard Component
const ProductCard = ({ id, title, author, price, image }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="font-bold mb-1">{title}</div>
        <div className="text-sm text-gray-600 mb-2">by {author}</div>
        <div className="flex justify-between items-center">
          <span className="font-bold">${price}</span>
          <FaHeart
            size={18}
            className={favorites.includes(id) ? 'text-red-500 cursor-pointer' : 'text-gray-300 cursor-pointer'}
            onClick={() => toggleFavorite(id)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;