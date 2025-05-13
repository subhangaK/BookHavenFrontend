import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaChevronRight, FaChevronLeft, FaBookOpen } from "react-icons/fa";
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
        <div className="flex items-center mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 tracking-wide">
            {title}
          </h3>
          <div className="h-px flex-1 bg-gray-200 ml-4"></div>
        </div>
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
                    ? "bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                    : "flex-shrink-0 w-56 snap-start bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                }
              >
                <div className="relative overflow-hidden rounded-lg mb-4 group">
                  <img
                    src={book.imagePath}
                    alt={book.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      console.warn(
                        `Failed to load image for ${book.title}: ${book.imagePath}`
                      );
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 truncate tracking-tight">
                  {book.title}
                </h3>
                <p className="text-gray-500 font-medium mt-1 text-xs">
                  by {book.author}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-indigo-600 font-semibold text-sm">
                    ${book.price.toFixed(2)}
                  </p>
                  <button className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors duration-300">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-white via-indigo-50 to-gray-100 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        
        <div className="container mx-auto px-8 py-24 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="flex-1 mb-16 md:mb-0 md:pr-16">
            <div className="inline-block px-4 py-2 mb-8 bg-indigo-100 text-indigo-700 font-medium rounded-full text-sm tracking-wider">
              Welcome to your literary journey
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight tracking-tight">
              Book <span className="text-indigo-600">Haven</span>
            </h1>
            <p className="text-gray-600 mb-12 text-lg max-w-md leading-relaxed">
              Discover stories that inspire, educate, and transport you to new worlds. Find your next favorite read today.
            </p>
            <div className="flex space-x-4">
              <a
                href="/productpage"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center transform hover:-translate-y-1"
              >
                Explore Collection
                <FaChevronRight className="ml-2" />
              </a>
              <a
                href="/about"
                className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 font-medium px-8 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
              >
                About Us
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative h-80 w-80 md:h-96 md:w-96">
              {/* Decorative book stack */}
              <div className="absolute left-0 bottom-0 w-32 h-72 bg-indigo-100 rounded-lg shadow-md transform -rotate-6 border-t-4 border-indigo-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"></div>
              <div className="absolute left-12 bottom-0 w-32 h-64 bg-indigo-200 rounded-lg shadow-md transform rotate-3 border-t-4 border-indigo-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"></div>
              <div className="absolute left-24 bottom-0 w-32 h-68 bg-indigo-300 rounded-lg shadow-md transform -rotate-2 border-t-4 border-indigo-400 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"></div>
              <div className="absolute left-36 bottom-0 w-36 h-60 bg-indigo-400 rounded-lg shadow-md transform rotate-1 border-t-4 border-indigo-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-8 mb-16">
        {/* Admin Banners */}
        {isLoading && (
          <div className="mt-8 mb-12">
            <div className="bg-gray-100 p-8 rounded-xl animate-pulse max-w-6xl mx-auto shadow-sm">
              <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
            </div>
          </div>
        )}

        {bannerError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-xl mx-auto max-w-6xl mt-8 mb-12 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300">
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
          <div className="mt-8 mb-12 space-y-6">
            {banners.map((banner, index) => (
              <Banner
                key={banner.id}
                message={banner.message}
                onClose={() => handleCloseBanner(banner.id)}
                type={index % 2 === 0 ? "info" : "promo"}
                className=""
                actionLabel={index % 2 === 0 ? "Learn More" : null}
                onAction={() => console.log("Banner action clicked")}
                showProgress={index % 3 === 0}
              />
            ))}
          </div>
        )}

        {/* Featured Books Section */}
        <div className="mt-12 mb-20">
          {bookError && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8">
              <p className="text-red-600 text-base font-medium tracking-wide">
                {bookError}
              </p>
            </div>
          )}
          
          {/* Section divider */}
          <div className="flex items-center mb-12">
            <FaBookOpen className="text-indigo-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Curated For You</h2>
            <div className="h-px flex-1 bg-gray-200 ml-4"></div>
          </div>
          
          {renderBookSection(featuredBooks, "Featured Selection", null, true)}
        </div>

        {/* Fiction and Non-Fiction Books Section */}
        <div className="mb-20">
          {/* Section divider */}
          <div className="flex items-center mb-12">
            <FaBookOpen className="text-indigo-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Explore by Genre</h2>
            <div className="h-px flex-1 bg-gray-200 ml-4"></div>
          </div>
          
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
        <div className="py-16 px-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-gray-50 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 rounded-full -ml-24 -mb-24 opacity-50"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-wide">
              Ready to discover more?
            </h2>
            <p className="text-gray-600 text-lg font-normal leading-relaxed mb-8">
              Our complete collection features thousands of titles across every genre. 
              From timeless classics to the latest bestsellers, we have something for every reader.
            </p>
            <button
              onClick={handleBrowseAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-10 py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center mx-auto transform hover:-translate-y-1"
            >
              Browse Full Collection
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;