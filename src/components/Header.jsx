import { useState, useContext, useEffect } from 'react';
import { FaSearch, FaHeart, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Header = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0); // Dynamic wishlist count
  const [cartCount, setCartCount] = useState(0); // Dynamic cart count
  const { user, roles, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch wishlist and cart counts when user changes (login/logout)
  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        setWishlistCount(0);
        setCartCount(0);
        return;
      }

      // Fetch wishlist
      try {
        const wishlistResponse = await axios.get(
          "https://localhost:7189/api/Wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        if (Array.isArray(wishlistResponse.data)) {
          setWishlistCount(wishlistResponse.data.length);
        } else {
          console.error("Expected an array for wishlist, got:", wishlistResponse.data);
          setWishlistCount(0);
        }
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
        setWishlistCount(0);
      }

      // Fetch cart
      try {
        const cartResponse = await axios.get(
          "https://localhost:7189/api/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        if (Array.isArray(cartResponse.data)) {
          setCartCount(cartResponse.data.length);
        } else {
          console.error("Expected an array for cart, got:", cartResponse.data);
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0);
      }
    };

    fetchCounts();
  }, [user]);

  const HeaderSearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        navigate(`/ProductPage?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
      }
    };

    return (
      <div className={`relative ${searchFocused ? 'flex-grow' : ''}`}>
        <input
          type="text"
          placeholder="Search books, authors, ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
          className={`pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-full ${
            searchFocused ? 'shadow-md' : ''
          }`}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!', { position: 'top-right', autoClose: 3000 });
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-12">
            <h1 className="text-2xl font-bold text-blue-600">BookHaven</h1>
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-gray-800 hover:text-blue-600 font-medium transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/ProductPage"
                className="text-gray-600 hover:text-blue-600 transition duration-300"
              >
                Products
              </Link>
              <Link
                to="/whishlist"
                className="text-gray-600 hover:text-blue-600 transition duration-300"
              >
                Wishlist
              </Link>
              <Link
                to="/best-sellers"
                className="text-gray-600 hover:text-blue-600 transition duration-300"
              >
                Best Sellers
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <HeaderSearchBar />

            <div className="flex items-center space-x-4">
              <Link to="/whishlist" className="relative text-gray-600 hover:text-blue-600 transition duration-300">
                <FaHeart className="text-xl" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition duration-300">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-600 hover:text-blue-600 transition duration-300"
                >
                  <FaUserCircle className="text-xl" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    {user ? (
                      <>
                        <Link
                          to="/userprofile"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                          onClick={() => setDropdownOpen(false)}
                        >
                          View Profile
                        </Link>
                        {roles.includes('SuperAdmin') && (
                          <Link
                            to="/AdminBook"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        {roles.includes('Staff') && (
                          <Link
                            to="/AdminOrder"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                            onClick={() => setDropdownOpen(false)}
                          >
                            View User Order
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                        >
                          Log Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/Login"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Log In
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;