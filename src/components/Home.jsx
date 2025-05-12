import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronRight } from 'react-icons/fa';
import Banner from './Banner';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [bannerError, setBannerError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get dismissed banner IDs from localStorage
  const getDismissedBanners = () => {
    const dismissed = localStorage.getItem('dismissedBanners');
    return dismissed ? JSON.parse(dismissed) : [];
  };

  // Helper function to save dismissed banner IDs to localStorage
  const saveDismissedBanner = (bannerId) => {
    const dismissed = getDismissedBanners();
    if (!dismissed.includes(bannerId)) {
      dismissed.push(bannerId);
      localStorage.setItem('dismissedBanners', JSON.stringify(dismissed));
    }
  };

  // Fetch active banners
  const fetchActiveBanners = async () => {
    setIsLoading(true);
    setBannerError('');
    try {
      const response = await axios.get('https://localhost:7189/api/Banner/active', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response:', response.data); // Debug response
      const fetchedBanners = Array.isArray(response.data) ? response.data : [];
      // Filter out invalid banners and dismissed banners
      const validBanners = fetchedBanners
        .filter((banner) => banner.id && banner.message)
        .filter((banner) => !getDismissedBanners().includes(banner.id))
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setBanners(validBanners);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch banners. Please try again later.';
      setBannerError(errorMessage);
      console.error('Fetch active banners error:', err, err.response); // Log full error details
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch banners on component mount
  useEffect(() => {
    fetchActiveBanners();
  }, []);

  // Handle banner close
  const handleCloseBanner = (id) => {
    saveDismissedBanner(id);
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  // Handle retry fetching banners
  const handleRetry = () => {
    fetchActiveBanners();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 mb-12 shadow-inner">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 mb-8 md:mb-0 md:pr-8">
            <div className="inline-block px-3 py-1 mb-4 bg-blue-100 text-blue-800 font-medium rounded-full text-sm">
              Limited Time Offer
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
              WORLD <span className="text-blue-600">BOOK</span> DAY
            </h1>
            <p className="text-gray-600 mb-8 text-lg max-w-lg">
              Discover amazing books and expand your knowledge with our special World Book Day collection. Up to 50% off on selected titles!
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center">
                Explore Now
                <FaChevronRight className="ml-2" />
              </button>
              <button className="bg-white hover:bg-gray-100 text-blue-600 font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg border border-blue-200">
                View Deals
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80">
              <div className="absolute left-0 bottom-0 w-24 h-56 bg-gradient-to-b from-blue-700 to-blue-900 rounded-sm shadow-lg transform -rotate-6 border-t-8 border-blue-300"></div>
              <div className="absolute left-8 bottom-0 w-24 h-48 bg-gradient-to-b from-red-600 to-red-900 rounded-sm shadow-lg transform rotate-3 border-t-8 border-red-300"></div>
              <div className="absolute left-16 bottom-0 w-24 h-52 bg-gradient-to-b from-purple-600 to-purple-900 rounded-sm shadow-lg transform -rotate-2 border-t-8 border-purple-300"></div>
              <div className="absolute left-24 bottom-0 w-28 h-44 bg-gradient-to-b from-amber-600 to-amber-900 rounded-sm shadow-lg transform rotate-1 border-t-8 border-amber-300"></div>
              <div className="absolute left-48 bottom-8 w-12 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-md shadow-lg"></div>
              <div className="absolute left-46 bottom-4 w-16 h-4 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full shadow-lg"></div>
              <div className="absolute left-50 bottom-14 w-6 h-3 bg-gray-100 opacity-30 rounded-full"></div>
              <div className="absolute left-52 bottom-24 w-4 h-2 bg-white opacity-30 rounded-full animate-ping"></div>
              <div className="absolute left-54 bottom-28 w-3 h-1 bg-white opacity-20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute left-52 bottom-32 w-2 h-1 bg-white opacity-10 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Banners */}
      {isLoading && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-gray-200 p-4 rounded-lg animate-pulse max-w-4xl mx-auto">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      )}
      
      {bannerError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mx-auto max-w-4xl mt-4 flex justify-between items-center">
          <span>{bannerError}</span>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      )}
      
      {!isLoading && banners.length > 0 && (
        <div className="container mx-auto px-4 mt-4 space-y-4">
          {banners.map((banner) => (
            <Banner
              key={banner.id}
              message={banner.message}
              onClose={() => handleCloseBanner(banner.id)}
            />
          ))}
        </div>
      )}
      
      {!isLoading && banners.length === 0 && !bannerError && (
        <div className="container mx-auto px-4 mt-4 text-gray-500 text-center">
          No active banners available.
        </div>
      )}

    </div>
  );
};

export default Home;