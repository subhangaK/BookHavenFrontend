import { useState, useEffect } from 'react';
import { 
  FaBook, 
  FaShoppingCart, 
  FaStar, 
  FaChevronRight, 
  FaChevronLeft,
  FaRegBookmark,
  FaBookmark
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [bookmarked, setBookmarked] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleBookmark = (id) => {
    setBookmarked(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = [
    { title: "Fiction & Literature", color: "bg-pink-100", icon: <FaBook className="text-pink-500 text-2xl" /> },
    { title: "Arts & Photography", color: "bg-amber-100", icon: <FaBook className="text-amber-500 text-2xl" /> },
    { title: "History & Biography", color: "bg-rose-100", icon: <FaBook className="text-rose-500 text-2xl" /> },
    { title: "Science & Technology", color: "bg-purple-100", icon: <FaBook className="text-purple-500 text-2xl" /> },
    { title: "Children's Books", color: "bg-pink-100", icon: <FaBook className="text-pink-500 text-2xl" /> }
  ];

  const books = [
    { 
      id: 1, 
      title: "The Midnight Library", 
      author: "Matt Haig", 
      price: 90, 
      image: "/api/placeholder/120/180",
      rating: 4.5,
      discount: "20%"
    },
    { 
      id: 2, 
      title: "A Court of Silver Flames", 
      author: "Sarah J. Maas", 
      price: 120, 
      image: "/api/placeholder/120/180",
      rating: 4.8
    },
    { 
      id: 3, 
      title: "The Invisible Life of Addie LaRue", 
      author: "V.E. Schwab", 
      price: 110, 
      image: "/api/placeholder/120/180",
      rating: 4.2,
      discount: "15%"
    },
    { 
      id: 4, 
      title: "Project Hail Mary", 
      author: "Andy Weir", 
      price: 130, 
      image: "/api/placeholder/120/180",
      rating: 4.7
    },
    { 
      id: 5, 
      title: "The Song of Achilles", 
      author: "Madeline Miller", 
      price: 95, 
      image: "/api/placeholder/120/180",
      rating: 4.9,
      discount: "25%"
    },
    { 
      id: 6, 
      title: "Klara and the Sun", 
      author: "Kazuo Ishiguro", 
      price: 125, 
      image: "/api/placeholder/120/180",
      rating: 4.3
    }
  ];

  const featuredCollections = [
    {
      title: "Summer Reading",
      description: "Perfect books for lazy summer days",
      color: "from-blue-400 to-purple-500",
      image: "/api/placeholder/200/120"
    },
    {
      title: "Award Winners",
      description: "The most acclaimed books of the year",
      color: "from-amber-400 to-red-500",
      image: "/api/placeholder/200/120"
    },
    {
      title: "Bestsellers",
      description: "What everyone is reading right now",
      color: "from-emerald-400 to-teal-600",
      image: "/api/placeholder/200/120"
    }
  ];

  const displayRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} className="text-yellow-500 text-sm" />
        ))}
        {hasHalfStar && <FaStar className="text-yellow-500 text-sm" />}
        <span className="ml-1 text-xs text-gray-600">{rating}</span>
      </div>
    );
  };

  const BookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl group">
      <div className="relative overflow-hidden">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-56 object-cover transition duration-500 transform group-hover:scale-110" 
        />
        {book.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {book.discount} OFF
          </div>
        )}
        <div 
          className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2 cursor-pointer transition-all duration-300 hover:bg-opacity-100"
          onClick={() => toggleBookmark(book.id)}
        >
          {bookmarked[book.id] ? 
            <FaBookmark className="text-blue-600" /> : 
            <FaRegBookmark className="text-gray-500" />
          }
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition duration-300"></div>
        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition duration-300 opacity-0 group-hover:opacity-100 flex items-center shadow-lg">
          <FaShoppingCart className="mr-2" />
          Add to Cart
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
        <p className="text-sm text-gray-500 mb-1">{book.author}</p>
        <div className="mb-2">
          {displayRating(book.rating)}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>
            {book.discount ? (
              <div className="flex items-center">
                <span className="font-medium text-gray-800">Rs {book.price}</span>
                <span className="text-xs text-gray-500 line-through ml-2">
                  Rs {Math.round(book.price / (1 - parseInt(book.discount) / 100))}
                </span>
              </div>
            ) : (
              <span className="font-medium text-gray-800">Rs {book.price}</span>
            )}
          </div>
          <span className="text-xs text-blue-600">In Stock</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

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

      {/* Featured Collections */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCollections.map((collection, index) => (
            <div key={index} className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer">
              <div className={`absolute inset-0 bg-gradient-to-r ${collection.color} opacity-90 group-hover:opacity-100 transition duration-300`}></div>
              <div className="relative p-6 h-full flex flex-col justify-between z-10">
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">{collection.title}</h3>
                  <p className="text-white text-opacity-90">{collection.description}</p>
                </div>
                <button className="mt-4 bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg transition duration-300 self-start flex items-center group-hover:shadow-md">
                  Explore
                  <FaChevronRight className="ml-2 text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Categories */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Categories</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <FaChevronRight className="ml-1 text-xs" />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className={`${category.color} rounded-lg p-6 shadow-sm hover:shadow-lg transition duration-300 cursor-pointer group overflow-hidden relative`}
              >
                <div className="absolute w-32 h-32 bg-white opacity-0 rounded-full -top-16 -right-16 group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-150"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 transform transition duration-300 group-hover:scale-110">
                    {category.icon}
                  </div>
                  <h3 className="font-medium mb-2">{category.title}</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    Shop Now <FaChevronRight className="ml-1 text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Released Books */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">New Released Books</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <FaChevronRight className="ml-1 text-xs" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Featured Books */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Featured Books</h2>
            <div className="flex space-x-2 bg-gray-100 rounded-lg p-1 shadow-sm">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition duration-300 ${activeTab === 'featured' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('featured')}
              >
                Featured
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition duration-300 ${activeTab === 'sale' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('sale')}
              >
                On Sale
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition duration-300 ${activeTab === 'viewed' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('viewed')}
              >
                Most Viewed
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
              {books.slice(0, 6).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            
            <button 
              onClick={() => setCurrentSlide((currentSlide - 1 + 3) % 3)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-600 hover:text-white transition duration-300"
            >
              <FaChevronLeft />
            </button>
            
            <button 
              onClick={() => setCurrentSlide((currentSlide + 1) % 3)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-600 hover:text-white transition duration-300"
            >
              <FaChevronRight />
            </button>
          </div>
          
          <div className="flex justify-center space-x-2 mb-12">
            {[0, 1, 2].map((dot) => (
              <button 
                key={dot}
                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === dot ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`}
                onClick={() => setCurrentSlide(dot)}
              ></button>
            ))}
          </div>
        </section>
        
        {/* Special Offer Banner */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 p-8 md:p-12">
                <div className="bg-white bg-opacity-20 text-white inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                  Special Offer
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get 25% Off Your First Purchase</h2>
                <p className="text-white text-opacity-90 mb-6 max-w-lg">
                  Sign up for our newsletter and receive a special discount code for your first order. Plus, get personalized book recommendations!
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-0 flex-1"
                  />
                  <button className="bg-white text-blue-500 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg whitespace-nowrap">
                    Subscribe Now
                  </button>
                </div>
              </div>
              <div className="md:w-1/3 p-8 hidden md:block">
                <img 
                  src="/api/placeholder/300/200" 
                  alt="Special offer books" 
                  className="rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition duration-500"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;