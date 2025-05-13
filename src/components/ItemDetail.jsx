import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const API_BASE_URL = "https://localhost:7189/";
  const token = localStorage.getItem("token");

  // Token refresh function
  const refreshToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/refresh`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
      toast.error("Session expired. Please log in again.");
      throw new Error("Session expired. Please log in again.");
    }
  };

  // Fetch reviews (public, no authentication needed)
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/Review/${id}`, {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status} - ${response.statusText || 'Unknown error'}`);
      }

      const reviewsData = await response.json();
      setReviews(reviewsData.reviews || []);
      setReviewCount(reviewsData.reviewCount || 0);
      setAverageRating(reviewsData.averageRating || 0);
    } catch (err) {
      console.error("Review fetch error:", err);
      throw err;
    }
  };

  // Main data fetching function
  const fetchData = async () => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid or missing book ID");
      }

      setLoading(true);
      setError(null);

      // Fetch book details (public)
      const bookResponse = await fetch(`${API_BASE_URL}api/auth/books/${id}`);
      if (!bookResponse.ok) throw new Error(`Book fetch failed: ${bookResponse.status} - ${bookResponse.statusText || 'Unknown error'}`);
      const bookData = await bookResponse.json();
      setBook({
        ...bookData,
        description: bookData.description || "No description available",
        longDescription: bookData.longDescription || "No additional details",
        inStock: bookData.price > 0,
        isOnSale: bookData.isOnSale || false,
        discountPercentage: bookData.discountPercentage || 0
      });

      // Fetch related books (public)
      const booksResponse = await fetch(`${API_BASE_URL}api/auth/books`);
      if (!booksResponse.ok) throw new Error(`Related books fetch failed: ${booksResponse.status} - ${booksResponse.statusText || 'Unknown error'}`);
      const booksData = await booksResponse.json();
      setRelatedBooks(
        booksData
          .filter(b => b.id !== bookData.id)
          .slice(0, 4)
          .map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            price: b.price,
            imagePath: b.imagePath,
            isOnSale: b.isOnSale || false,
            discountPercentage: b.discountPercentage || 0
          }))
      );

      // Fetch reviews (public)
      await fetchReviews();

      // Fetch user orders if authenticated (protected)
      if (token) {
        setOrdersLoading(true);
        try {
          let headers = { 
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          };
          
          let response = await fetch(`${API_BASE_URL}api/Order`, { headers });
          
          if (response.status === 401) {
            const newToken = await refreshToken();
            headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(`${API_BASE_URL}api/Order`, { headers });
          }

          if (!response.ok) throw new Error(`Orders fetch failed: ${response.status} - ${response.statusText || 'Unknown error'}`);
          
          const ordersData = await response.json();
          setUserOrders(ordersData || []);
        } catch (err) {
          console.error("Orders fetch error:", err);
        } finally {
          setOrdersLoading(false);
        }
      }
    } catch (err) {
      if (err.message.includes("401") && retryCount < 2) {
        setRetryCount(c => c + 1);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchData();
      }
      setError(err.message);
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart function
  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    if (!book.inStock) {
      toast.error("This book is out of stock.");
      return;
    }

    try {
      let currentToken = token;
      let headers = {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
        Accept: "*/*"
      };

      // Check if book is already in an order
      const orderResponse = await axios.get(`${API_BASE_URL}api/Order`, { headers });

      if (!Array.isArray(orderResponse.data)) {
        console.error("Expected an array for orders, got:", orderResponse.data);
        toast.error("Failed to verify order status. Please try again.");
        return;
      }

      const isInOrder = orderResponse.data.some((order) => order.id === Number(id));
      if (isInOrder) {
        toast.error("This book is already in an order and cannot be added to the cart.");
        return;
      }

      // Add to cart
      const response = await axios.post(
        `${API_BASE_URL}api/Cart/add`,
        { bookId: Number(id), quantity },
        { headers }
      );

      // If unauthorized, refresh token and retry
      if (response.status === 401) {
        currentToken = await refreshToken();
        headers.Authorization = `Bearer ${currentToken}`;
        await axios.post(
          `${API_BASE_URL}api/Cart/add`,
          { bookId: Number(id), quantity },
          { headers }
        );
      }

      toast.success("Book added to cart successfully!");
      setTimeout(() => navigate("/cart"), 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 404) {
        toast.error("Book not found.");
      } else if (error.response?.status === 400) {
        toast.error("Book already in cart or invalid request.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to add book to cart. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, retryCount]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      toast.error("Please log in to submit a review.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      let currentToken = token;
      let headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`
      };

      // First attempt
      let response = await axios.post(
        `${API_BASE_URL}api/Review`,
        { bookId: Number(id), rating, comment },
        { headers }
      );

      // If unauthorized, refresh and retry
      if (response.status === 401) {
        currentToken = await refreshToken();
        headers.Authorization = `Bearer ${currentToken}`;
        response = await axios.post(
          `${API_BASE_URL}api/Review`,
          { bookId: Number(id), rating, comment },
          { headers }
        );
      }

      console.log("Review submitted:", response.data);

      // Refresh reviews after submission
      await fetchReviews();

      setShowReviewForm(false);
      setRating(0);
      setComment("");
      toast.success("Review submitted successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        setSubmitError("Session expired. Please log in again.");
        toast.error("Session expired. Please log in again.");
      } else {
        setSubmitError(err.response?.data?.message || "Failed to submit review");
        toast.error(err.response?.data?.message || "Failed to submit review");
      }
      console.error("Review submission error:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const numericId = Number(id);
  const hasPurchased = userOrders.some(
    order => order.id === numericId && order.isPurchased
  );

  // Calculate discounted price
  const discountedPrice = book?.isOnSale && book?.discountPercentage > 0
    ? (book.price * (1 - book.discountPercentage / 100)).toFixed(2)
    : null;

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-white flex items-center justify-center">Error: {error}</div>;
  if (!book) return <div className="min-h-screen bg-white flex items-center justify-center">Book not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb navigation */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-blue-500">Home</a>
          <span className="mx-2">/</span>
          <a href="/books" className="hover:text-blue-500">Books</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{book.title}</span>
        </div>

        <a href="/books" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6">
          <FaArrowLeft className="mr-2" /> Back to Books
        </a>

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Book image */}
          <div className="md:w-1/3 relative">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-full">
              {book.imagePath ? (
                <img 
                  src={`${API_BASE_URL}${book.imagePath}`} 
                  alt={book.title} 
                  className="max-h-96 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = `
                      <div class="flex flex-col items-center justify-center text-gray-400">
                        <FaBookOpen size={64} />
                        <p class="mt-2">Cover Image</p>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FaBookOpen size={64} />
                  <p className="mt-2">Cover Image</p>
                </div>
              )}
            </div>
            {book.isOnSale && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                Sale!
              </div>
            )}
          </div>

          {/* Book details */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <div className="text-xl text-gray-600 mb-4">by {book.author}</div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              <span className="text-gray-600">({reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline mb-6">
              {book.isOnSale && discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-blue-600 mr-2">${discountedPrice}</span>
                  <span className="text-lg text-gray-500 line-through">${book.price.toFixed(2)}</span>
                  <span className="text-sm text-blue-500 ml-2">({book.discountPercentage}% off)</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-blue-600">${book.price.toFixed(2)}</span>
              )}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-gray-500 text-sm">Title</div>
                <div className="font-medium">{book.title}</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-gray-500 text-sm">Author</div>
                <div className="font-medium">{book.author}</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-gray-500 text-sm">Publication Year</div>
                <div className="font-medium">{book.publicationYear}</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-gray-500 text-sm">Price</div>
                <div className="font-medium">
                  {book.isOnSale && discountedPrice 
                    ? `$${discountedPrice} (was $${book.price.toFixed(2)})` 
                    : `$${book.price.toFixed(2)}`}
                </div>
              </div>
            </div>

            {/* Quantity and buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex border border-gray-300 rounded-md">
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-l-md"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <div className="px-4 py-2 border-l border-r border-gray-300 min-w-16 text-center">
                  {quantity}
                </div>
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-r-md"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>

              <button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                onClick={handleAddToCart}
                disabled={!book.inStock}
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                <FaHeart className="text-red-500" />
              </button>
            </div>

            {/* Stock status */}
            <div className="flex items-center text-sm">
              <div className={`w-3 h-3 rounded-full mr-2 ${book.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
              <span>{book.inStock ? "In Stock" : "Out of Stock"}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "description" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "details" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Additional Details
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "reviews" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          {/* Tab content */}
          <div className="py-6">
            {activeTab === "description" && (
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">{book.description}</p>
                <p className="text-gray-700 leading-relaxed">{book.longDescription}</p>
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Book Details</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-500">Title</td>
                        <td className="py-3 font-medium">{book.title}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-500">Author</td>
                        <td className="py-3 font-medium">{book.author}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-500">ISBN</td>
                        <td className="py-3 font-medium">{book.isbn}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-500">Publication Year</td>
                        <td className="py-3 font-medium">{book.publicationYear}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-500">Price</td>
                        <td className="py-3 font-medium">
                          {book.isOnSale && discountedPrice 
                            ? `$${discountedPrice} (was $${book.price.toFixed(2)})` 
                            : `$${book.price.toFixed(2)}`}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Customer Reviews</h3>
                  {ordersLoading ? (
                    <span className="text-gray-500">Checking purchase status...</span>
                  ) : token && hasPurchased ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Write a Review
                    </button>
                  ) : (
                    <span className="text-gray-500">
                      {token ? "Purchase this book to write a review." : "Log in to write a review."}
                    </span>
                  )}
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-6 p-4 border border-gray-200 rounded-md">
                    <h4 className="font-semibold mb-4">Write Your Review</h4>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Rating</label>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`cursor-pointer text-2xl ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Comment</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        maxLength={500}
                        rows={4}
                        placeholder="Share your thoughts about this book..."
                      />
                    </div>
                    <div className="flex items-center">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        disabled={submitLoading}
                      >
                        {submitLoading ? "Submitting..." : "Submit Review"}
                      </button>
                      <button
                        type="button"
                        className="ml-4 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                    {submitError && (
                      <p className="text-red-500 mt-2 text-sm">{submitError}</p>
                    )}
                  </form>
                )}

                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => {
                      const reviewDate = review.datePosted
                        ? new Date(review.datePosted).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "Unknown date";

                      return (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                              {(review.userName || "A").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">
                                {review.userName || "Anonymous"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Verified Purchase • {reviewDate}
                              </div>
                            </div>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 whitespace-pre-line">
                            {review.comment || "No review text provided"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related books */}
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBooks.map((relatedBook) => (
              <div key={relatedBook.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow relative">
                {relatedBook.isOnSale && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Sale!
                  </div>
                )}
                <a href={`/books/${relatedBook.id}`} className="block">
                  <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                    {relatedBook.imagePath ? (
                      <img
                        src={`${API_BASE_URL}${relatedBook.imagePath}`}
                        alt={relatedBook.title}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = `
                            <div class="flex flex-col items-center justify-center text-gray-400">
                              <FaBookOpen size={48} />
                              <p class="mt-2">Cover Image</p>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FaBookOpen size={48} />
                        <p className="mt-2">Cover Image</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{relatedBook.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{relatedBook.author}</p>
                    <div className="font-bold text-blue-600">
                      {relatedBook.isOnSale && relatedBook.discountPercentage > 0 ? (
                        <>
                          <span>${(relatedBook.price * (1 - relatedBook.discountPercentage / 100)).toFixed(2)}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">${relatedBook.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span>${relatedBook.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}