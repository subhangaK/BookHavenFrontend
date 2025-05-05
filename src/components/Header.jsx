import { useState } from 'react';
import { FaSearch, FaHeart, FaShoppingCart, FaUserCircle, FaChevronRight } from 'react-icons/fa';

const Header = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  const HeaderSearchBar = () => (
    <div className={`relative ${searchFocused ? 'flex-grow' : ''}`}>
      <input
        type="text"
        placeholder="Search books, authors, genres..."
        className={`pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-full ${searchFocused ? 'shadow-md' : ''}`}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
    </div>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-12">
            <h1 className="text-2xl font-bold text-blue-600">BookHaven</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-800 hover:text-blue-600 font-medium transition duration-300">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition duration-300">Categories</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition duration-300">New Releases</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition duration-300">Best Sellers</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-6">
            <HeaderSearchBar />
            
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-600 hover:text-blue-600 transition duration-300">
                <FaHeart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              
              <button className="relative text-gray-600 hover:text-blue-600 transition duration-300">
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
              </button>
              
              <button className="text-gray-600 hover:text-blue-600 transition duration-300">
                <FaUserCircle className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;