import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [bannerError, setBannerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [fictionBooks, setFictionBooks] = useState([]);
  const [nonFictionBooks, setNonFictionBooks] = useState([]);
  const [bookError, setBookError] = useState("");

  // Refs for scroll containers
  const featuredRef = useRef(null);
  const fictionRef = useRef(null);
  const nonFictionRef = useRef(null);

  // Navigation
  const navigate = useNavigate();

  // Helper function to get dismissed banner IDs from localStorage
  const getDismissedBanners = () => {
    const dismissed = localStorage.getItem("dismissedBanners");
    return dismissed ? JSON.parse(dismissed) : [];
  };

  // Helper function to save dismissed banner IDs to localStorage
  const saveDismissedBanner = (bannerId) => {
    const dismissed = getDismissedBanners();
    if (!dismissed.includes(bannerId)) {
      dismissed.push(bannerId);
      localStorage.setItem("dismissedBanners", JSON.stringify(dismissed));
    }
  };

  // Fetch active banners
  const fetchActiveBanners = async () => {
    setIsLoading(true);
    setBannerError("");
    try {
      const response = await axios.get(
        "https://localhost:7189/api/Banner/active",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const fetchedBanners = Array.isArray(response.data) ? response.data : [];
      const validBanners = fetchedBanners
        .filter((banner) => banner.id && banner.message)
        .filter((banner) => !getDismissedBanners().includes(banner.id))
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setBanners(validBanners);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch banners. Please try again later.";
      setBannerError(errorMessage);
      console.error("Fetch active banners error:", err, err.response);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all books and split into featured, fiction, and non-fiction
  const fetchBooks = async () => {
    try {
      const response = await fetch("https://localhost:7189/api/Auth/books");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const booksData = await response.json();

      // Format books and handle ImagePath
      const formattedBooks = booksData.map((book) => {
        let imageUrl = book.imagePath;
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `https://localhost:7189${
            imageUrl.startsWith("/") ? "" : "/"
          }${imageUrl}`;
        }
        return {
          id: book.id.toString(),
          title: book.title,
          author: book.author,
          price: book.price,
          imagePath: imageUrl || "https://via.placeholder.com/150",
          category: book.category || "General",
          publicationYear: book.publicationYear || 2020,
          isbn: book.isbn || "",
        };
      });

      // Split books into featured, fiction, and non-fiction
      const fiction = formattedBooks
        .filter((book) => book.category === "Fiction")
        .slice(0, 10);
      const nonFiction = formattedBooks
        .filter((book) => book.category === "Nonfiction")
        .slice(0, 10);
      const featured = formattedBooks.slice(0, 5);

      setFeaturedBooks(featured);
      setFictionBooks(fiction);
      setNonFictionBooks(nonFiction);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBookError("Failed to fetch books. Please try again later.");
      setFeaturedBooks([]);
      setFictionBooks([]);
      setNonFictionBooks([]);
    }
  };

  // Scroll functions
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Navigate to product page
  const handleBrowseAll = () => {
    navigate("/productpage");
  };

  // Navigate to book details page
  const navigateToDetails = (id) => {
    navigate(`/books/${id}`);
  };

  // Fetch banners and books on component mount
  useEffect(() => {
    fetchActiveBanners();
    fetchBooks();
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

  // Banner component
  const Banner = ({ message, type, onClose }) => {
    const bgColor = type === "info" ? "bg-blue-50" : "bg-amber-50";
    const textColor = type === "info" ? "text-blue-600" : "text-amber-700";
    const borderColor = type === "info" ? "border-blue-100" : "border-amber-200";

    return (
      <div className={`${bgColor} ${borderColor} border rounded-lg p-4 flex justify-between items-center`}>
        <p className={`${textColor} font-medium`}>{message}</p>
        <button 
          onClick={onClose}
          className={`${textColor} hover:bg-opacity-10 hover:bg-gray-700 rounded-full p-1`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/20')] opacity-[0.03] bg-repeat"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wider text-blue-700 bg-blue-50 rounded-full">
                  A world of books awaits you
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-gray-800 mb-6">
                  Find your next <span className="font-medium text-blue-500">literary</span> adventure
                </h1>
                <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
                  Explore our carefully curated collection of books that inspire, educate, and transport you to new worlds.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate("/productpage")}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-sm"
                  >
                    Browse Collection
                  </button>
                  <button 
                    onClick={() => navigate("/about")}
                    className="px-6 py-3 bg-transparent border border-blue-200 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                  >
                    About Us
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative h-96 w-full">
                  <div className="absolute right-0 bottom-0 w-64 h-80 transform -rotate-6">
                    <div className="w-full h-full bg-blue-50 rounded-lg shadow-lg overflow-hidden">
                      <div className="p-4 bg-blue-100 border-b border-blue-200">
                        <div className="w-2/3 h-4 bg-blue-200 rounded"></div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="w-full h-3 bg-blue-100 rounded"></div>
                        <div className="w-5/6 h-3 bg-blue-100 rounded"></div>
                        <div className="w-4/6 h-3 bg-blue-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-16 bottom-8 w-64 h-80 transform rotate-3">
                    <div className="w-full h-full bg-amber-50 rounded-lg shadow-lg overflow-hidden">
                      <div className="p-4 bg-amber-100 border-b border-amber-200">
                        <div className="w-2/3 h-4 bg-amber-200 rounded"></div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="w-full h-3 bg-amber-100 rounded"></div>
                        <div className="w-5/6 h-3 bg-amber-100 rounded"></div>
                        <div className="w-4/6 h-3 bg-amber-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-32 bottom-16 w-64 h-80 transform -rotate-2">
                    <div className="w-full h-full bg-blue-50 rounded-lg shadow-lg overflow-hidden">
                      <div className="p-4 bg-blue-100 border-b border-blue-200">
                        <div className="w-2/3 h-4 bg-blue-200 rounded"></div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="w-full h-3 bg-blue-100 rounded"></div>
                        <div className="w-5/6 h-3 bg-blue-100 rounded"></div>
                        <div className="w-4/6 h-3 bg-blue-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Banners */}
        {isLoading && (
          <div className="mb-8">
            <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        )}

        {bannerError && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex justify-between items-center">
              <span className="text-red-600 font-medium">{bannerError}</span>
              <button
                onClick={handleRetry}
                className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!isLoading && banners.length > 0 && (
          <div className="mb-12 space-y-4">
            {banners.map((banner, index) => (
              <Banner
                key={banner.id}
                message={banner.message}
                onClose={() => handleCloseBanner(banner.id)}
                type={index % 2 === 0 ? "info" : "promo"}
              />
            ))}
          </div>
        )}

        {/* Featured Books */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-light text-gray-800">
              <span className="border-b-2 border-blue-400 pb-1">Featured Books</span>
            </h2>
          </div>
          
          {bookError && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8">
              <p className="text-red-600">{bookError}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {featuredBooks.map((book) => (
              <div 
                key={book.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer"
                onClick={() => navigateToDetails(book.id)}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={book.imagePath}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button 
                      className="w-full py-2 bg-white/90 text-gray-800 text-sm font-medium rounded"
                      onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking Quick View
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-medium text-gray-800 truncate">{book.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{book.author}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-blue-700 font-medium">${book.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Book Sections with Horizontal Scroll */}
        {[
          { title: "Fiction", books: fictionBooks, ref: fictionRef },
          { title: "Non-Fiction", books: nonFictionBooks, ref: nonFictionRef }
        ].map((section) => (
          <section key={section.title} className="mb-16">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-light text-gray-800">
                <span className="border-b-2 border-blue-400 pb-1">{section.title}</span>
              </h2>
            </div>
            
            <div className="relative">
              <button
                onClick={() => scrollLeft(section.ref)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div
                ref={section.ref}
                className="flex overflow-x-auto gap-6 py-4 px-2 hide-scrollbar snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {section.books.map((book) => (
                  <div
                    key={book.id}
                    className="flex-shrink-0 w-48 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 snap-start cursor-pointer"
                    onClick={() => navigateToDetails(book.id)}
                  >
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={book.imagePath}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 truncate text-sm">{book.title}</h3>
                      <p className="text-gray-500 text-xs mb-2">{book.author}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 text-sm font-medium">${book.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => scrollRight(section.ref)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </section>
        ))}

        {/* Call to Action */}
        <section className="mb-16">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-12">
            <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
              <div className="w-64 h-64 rounded-full bg-blue-100 opacity-50"></div>
            </div>
            <div className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3">
              <div className="w-64 h-64 rounded-full bg-blue-100 opacity-50"></div>
            </div>
            
            <div className="relative z-10 max-w-xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-800 mb-6">
                Discover Your Next Favorite Read
              </h2>
              <p className="text-gray-600 mb-8">
                Our complete collection features thousands of titles across every genre. 
                Find the perfect book for any occasion.
              </p>
              <button
                onClick={handleBrowseAll}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-sm inline-flex items-center"
              >
                Browse Full Collection
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Reading Recommendations */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-light text-gray-800">
              <span className="border-b-2 border-blue-400 pb-1">Staff Picks</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex">
              <div className="w-1/3">
                <div className="h-full bg-blue-100 flex items-center justify-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="w-2/3 p-6">
                <h3 className="font-medium text-lg text-gray-800 mb-2">For Fiction Lovers</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Our librarians have curated a special collection of contemporary fiction that will transport you to new worlds.
                </p>
                <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-600 inline-flex items-center">
                  View Collection
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex">
              <div className="w-1/3">
                <div className="h-full bg-blue-100 flex items-center justify-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="w-2/3 p-6">
                <h3 className="font-medium text-lg text-gray-800 mb-2">Non-Fiction Essentials</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Expand your knowledge with our selection of thought-provoking non-fiction titles on science, history, and philosophy.
                </p>
                <a href="#" className="text-blue-500 text-sm font-medium hover:text-blue-600 inline-flex items-center">
                  View Collection
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Home;