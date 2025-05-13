import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Banner from "./Banner";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [bannerError, setBannerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [fictionBooks, setFictionBooks] = useState([]);
  const [nonFictionBooks, setNonFictionBooks] = useState([]);
  const [bookError, setBookError] = useState("");

  // Refs for scroll containers
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

  // Handle navigation to product page
  const handleBrowseAll = () => {
    navigate("/productpage");
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

  // Render book section
  const renderBookSection = (books, title, scrollRef, isFeatured = false) => {
    if (books.length === 0 && !bookError) {
      return (
        <p className="text-gray-600 text-base font-medium tracking-wide">{`No ${title.toLowerCase()} books available.`}</p>
      );
    }

    return (
      <div className="relative">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8 tracking-wide">
          {title}
        </h3>
        <div className="relative">
          {!isFeatured && (
            <>
              <button
                onClick={() => scrollLeft(scrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-md hover:shadow-lg z-10 transition-all duration-300 hover:bg-gray-100 hover:scale-110"
                aria-label="Scroll left"
              >
                <FaChevronLeft className="text-base" />
              </button>
              <button
                onClick={() => scrollRight(scrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-md hover:shadow-lg z-10 transition-all duration-300 hover:bg-gray-100 hover:scale-110"
                aria-label="Scroll right"
              >
                <FaChevronRight className="text-base" />
              </button>
            </>
          )}
          <div
            ref={scrollRef}
            className={
              isFeatured
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                : "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6"
            }
            style={{ scrollSnapType: isFeatured ? "none" : "x mandatory" }}
          >
            {books.map((book) => (
              <div
                key={book.id}
                className={
                  isFeatured
                    ? "bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    : "flex-shrink-0 w-56 snap-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                }
              >
                <img
                  src={book.imagePath}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 hover:scale-102"
                  onError={(e) => {
                    console.warn(
                      `Failed to load image for ${book.title}: ${book.imagePath}`
                    );
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <h3 className="text-base font-semibold text-gray-900 truncate tracking-tight">
                  {book.title}
                </h3>
                <p className="text-gray-500 font-medium mt-1 text-xs">
                  {book.author}
                </p>
                <p className="text-blue-500 font-semibold mt-2 text-sm">
                  ${book.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 mb-20 shadow-sm">
        <div className="container mx-auto px-8 py-32 flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 mb-16 md:mb-0 md:pr-16">
            <div className="inline-block px-4 py-2 mb-8 bg-blue-100 text-blue-700 font-medium rounded-full text-sm tracking-wider uppercase">
              Limited Time Offer
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              BOOK <span className="text-blue-500">HAVEN</span>
            </h1>
            <p className="text-gray-600 mb-12 text-lg max-w-md leading-relaxed font-medium">
              Escape into stories that stay with you. Limited-time deals on
              must-reads across every genre!
            </p>
            <div className="flex space-x-6">
              <a
                href="/productpage"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center transform hover:-translate-y-1"
              >
                Explore Now
                <FaChevronRight className="ml-3" />
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative h-80 w-80 md:h-96 md:w-96">
              <div className="absolute left-0 bottom-0 w-32 h-72 bg-blue-200 rounded-lg shadow-md transform -rotate-6 border-t-4 border-blue-300 transition-all duration-500 hover:-translate-y-2"></div>
              <div className="absolute left-12 bottom-0 w-32 h-64 bg-blue-300 rounded-lg shadow-md transform rotate-3 border-t-4 border-blue-400 transition-all duration-500 hover:-translate-y-2"></div>
              <div className="absolute left-24 bottom-0 w-32 h-68 bg-blue-400 rounded-lg shadow-md transform -rotate-2 border-t-4 border-blue-500 transition-all duration-500 hover:-translate-y-2"></div>
              <div className="absolute left-36 bottom-0 w-36 h-60 bg-blue-500 rounded-lg shadow-md transform rotate-1 border-t-4 border-blue-600 transition-all duration-500 hover:-translate-y-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="container mx-auto px-8 mt-16 mb-16">
        {bookError && (
          <p className="text-red-600 mb-6 text-base font-medium tracking-wide">
            {bookError}
          </p>
        )}
        {renderBookSection(featuredBooks, "Featured", null, true)}
      </div>

      {/* Admin Banners */}
      {isLoading && (
        <div className="container mx-auto px-8 mt-12">
          <div className="bg-gray-100 p-8 rounded-xl animate-pulse max-w-6xl mx-auto shadow-sm">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
          </div>
        </div>
      )}

      {bannerError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-xl mx-auto max-w-6xl mt-12 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300">
          <span className="font-medium text-lg tracking-wide">
            {bannerError}
          </span>
          <button
            onClick={handleRetry}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && banners.length > 0 && (
        <div className="container mx-auto px-8 mt-12 space-y-8">
          {banners.map((banner) => (
            <Banner
              key={banner.id}
              message={banner.message}
              onClose={() => handleCloseBanner(banner.id)}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            />
          ))}
        </div>
      )}

      {!isLoading && banners.length === 0 && !bannerError && (
        <div className="container mx-auto px-8 mt-12 text-gray-600 text-base font-medium text-center tracking-wide">
          No active banners available.
        </div>
      )}

      {/* Fiction and Non-Fiction Books Section */}
      <div className="container mx-auto px-8 mt-16 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-wide">
          Explore by Genre
        </h2>
        {bookError && (
          <p className="text-red-600 mb-6 text-base font-medium tracking-wide">
            {bookError}
          </p>
        )}
        {/* Fiction Books */}
        <div className="mb-16">
          {renderBookSection(fictionBooks, "Fiction", fictionRef)}
        </div>
        {/* Non-Fiction Books */}
        <div>
          {renderBookSection(nonFictionBooks, "Non-Fiction", nonFictionRef)}
        </div>
      </div>

      {/* Browse All Books Section */}
      <div className="container mx-auto px-8 py-16 text-center bg-blue-50 rounded-xl shadow-sm">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-wide">
          Ready to browse all books?
        </h2>
        <p className="text-gray-600 text-base font-medium leading-relaxed max-w-xl mx-auto mb-8">
          Dive into our vast collection of books – from timeless classics to the
          latest bestsellers, we have something for every reader. Start your
          literary journey today!
        </p>
        <button
          onClick={handleBrowseAll}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center mx-auto transform hover:-translate-y-1"
        >
          Browse Now
          <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Home;
