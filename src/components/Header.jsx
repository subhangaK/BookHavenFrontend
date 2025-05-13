import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import NotificationBar from './NotificationBar';

const Header = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, roles, logout } = useContext(AuthContext);
  const { notifications, toggleNotificationBar } = useNotifications();
  
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        setWishlistCount(0);
        setCartCount(0);
        return;
      }

      try {
        const wishlistResponse = await axios.get("https://localhost:7189/api/Wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistCount(Array.isArray(wishlistResponse.data) ? wishlistResponse.data.length : 0);
      } catch {
        setWishlistCount(0);
      }

      try {
        const cartResponse = await axios.get("https://localhost:7189/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartCount(Array.isArray(cartResponse.data) ? cartResponse.data.length : 0);
      } catch {
        setCartCount(0);
      }
    };

    fetchCounts();
  }, [user]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/ProductPage?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!', { position: 'top-right', autoClose: 3000 });
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo and search */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-light text-gray-800">Book<span className="font-medium text-blue-500">Haven</span></span>
            </Link>
          </div>

          {/* Search bar - desktop */}
          <div className={`hidden md:block relative max-w-md w-full mx-4 ${searchFocused ? 'flex-grow' : ''}`}>
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className={`w-full pl-12 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ${
                searchFocused ? 'shadow-md' : ''
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <Link 
              to="/whishlist" 
              className="relative p-2 text-gray-600 hover:text-blue-500 transition duration-300"
              aria-label="Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-blue-500 transition duration-300"
              aria-label="Shopping Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={toggleNotificationBar}
                className="p-2 text-gray-600 hover:text-blue-500 transition duration-300"
                aria-label={`Notifications, ${unreadCount} unread`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationBar />
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 text-gray-600 hover:text-blue-500 transition duration-300 flex items-center"
                aria-label="User menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                  {user ? (
                    <>
                      <Link 
                        to="/userprofile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300" 
                        onClick={() => setDropdownOpen(false)}
                      >
                        View Profile
                      </Link>
                      {roles.includes('SuperAdmin') && (
                        <>
                          <Link 
                            to="/AdminBook" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300" 
                            onClick={() => setDropdownOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                          <Link 
                            to="/adminbanner" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300" 
                            onClick={() => setDropdownOpen(false)}
                          >
                            Admin Banner
                          </Link>
                        </>
                      )}
                      {roles.includes('Staff') && (
                        <Link 
                          to="/AdminOrder" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300" 
                          onClick={() => setDropdownOpen(false)}
                        >
                          View All Orders
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1"></div>
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/Login" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-300" 
                      onClick={() => setDropdownOpen(false)}
                    >
                      Log In
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-50 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex py-4">
          <ul className="flex space-x-8">
            <li>
              <Link
                to="/"
                className="text-gray-800 hover:text-blue-500 font-medium pb-4 border-b-2 border-transparent hover:border-blue-500 transition-all duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/ProductPage"
                className="text-gray-600 hover:text-blue-500 pb-4 border-b-2 border-transparent hover:border-blue-500 transition-all duration-300"
              >
                Browse Books
              </Link>
            </li>
            <li>
              <Link
                to="/whishlist"
                className="text-gray-600 hover:text-blue-500 pb-4 border-b-2 border-transparent hover:border-blue-500 transition-all duration-300"
              >
                Wishlist
              </Link>
            </li>
                        <li>
              <Link
                to="/order"
                className="text-gray-600 hover:text-blue-500 pb-4 border-b-2 border-transparent hover:border-blue-500 transition-all duration-300"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/about-us"
                className="text-gray-600 hover:text-blue-500 pb-4 border-b-2 border-transparent hover:border-blue-500 transition-all duration-300"
              >
                About Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            {/* Mobile search */}
            <div className="px-2 pt-2 pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books, authors, ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Mobile navigation links */}
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-100">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-500 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/ProductPage"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Books
              </Link>
              <Link
                to="/whishlist"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;