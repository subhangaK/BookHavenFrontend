import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import axios from "axios";

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

  const API_BASE_URL = "https://localhost:7189/";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || id === "undefined") {
          throw new Error("Invalid or missing book ID. Please select a book.");
        }

        console.log("Current book ID:", id);
        console.log("Converted book ID (Number(id)):", Number(id));

        setLoading(true);

        // Fetch book details
        const bookResponse = await fetch(`${API_BASE_URL}api/auth/books/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (!bookResponse.ok) throw new Error(`Failed to fetch book: ${bookResponse.status} - ${bookResponse.statusText}`);
        const bookData = await bookResponse.json();
        setBook({
          ...bookData,
          description: bookData.description || "No description available.",
          longDescription: bookData.longDescription || "No additional details available.",
          inStock: bookData.price > 0,
        });

        // Fetch related books
        const booksResponse = await fetch(`${API_BASE_URL}api/auth/books`, {
          headers: { Accept: "application/json" },
        });
        if (!booksResponse.ok) throw new Error(`Failed to fetch related books: ${booksResponse.statusText}`);
        const booksData = await booksResponse.json();
        const filteredBooks = booksData
          .filter((b) => b.id !== bookData.id)
          .slice(0, 4)
          .map((b) => ({ id: b.id, title: b.title, author: b.author, price: b.price, imagePath: b.imagePath }));
        setRelatedBooks(filteredBooks);

        // Fetch reviews
        const reviewsResponse = await fetch(`${API_BASE_URL}api/Review/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (!reviewsResponse.ok) {
          throw new Error(`Failed to fetch reviews: ${reviewsResponse.status} - ${reviewsResponse.statusText}`);
        }
        const reviewsData = await reviewsResponse.json();
        console.log("Reviews data:", JSON.stringify(reviewsData, null, 2));
        setReviews(reviewsData.reviews || []);
        setReviewCount(reviewsData.reviewCount || 0);
        setAverageRating(reviewsData.averageRating || 0);

        // Fetch user orders if logged in
        if (token) {
          setOrdersLoading(true);
          const ordersResponse = await fetch(`${API_BASE_URL}api/Order`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!ordersResponse.ok) {
            if (ordersResponse.status === 401) {
              localStorage.removeItem("token");
              navigate("/login");
              throw new Error("Session expired. Please log in again.");
            }
            throw new Error(`Failed to fetch orders: ${ordersResponse.status} - ${ordersResponse.statusText}`);
          }
          const ordersData = await ordersResponse.json();
          setUserOrders(ordersData || []);
          console.log("Orders data:", JSON.stringify(ordersData, null, 2));
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
        setOrdersLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/Review`,
        { bookId: Number(id), rating, comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Review submission response:", JSON.stringify(response.data, null, 2));

      // Refetch reviews after submission
      const reviewsResponse = await fetch(`${API_BASE_URL}api/Review/${id}`, {
        headers: { Accept: "application/json" },
      });
      if (!reviewsResponse.ok) {
        throw new Error(`Failed to fetch updated reviews: ${reviewsResponse.status} - ${reviewsResponse.statusText}`);
      }
      const updatedReviewsData = await reviewsResponse.json();
      console.log("Updated reviews data:", JSON.stringify(updatedReviewsData, null, 2));
      setReviews(updatedReviewsData.reviews || []);
      setReviewCount(updatedReviewsData.reviewCount || 0);
      setAverageRating(updatedReviewsData.averageRating || 0);

      setShowReviewForm(false);
      setRating(0);
      setComment("");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        setSubmitError("Session expired. Please log in again.");
      } else {
        setSubmitError(err.response?.data || "Failed to submit review. Please try again.");
        console.error("Review submission error:", err.response || err);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const numericId = Number(id);
  console.log("Comparing book ID:", numericId);
  userOrders.forEach((order) => {
    console.log(
      `Order ID: ${order.id}, Matches: ${order.id === numericId}, Purchased: ${order.hasPurchased || order.isPurchased}`
    );
  });

  const hasPurchased = userOrders.some((order) => order.id === numericId && (order.hasPurchased || order.isPurchased));

  console.log({ token, userOrders, hasPurchased });

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-white flex items-center justify-center">Error: {error}</div>;
  if (!book) return <div className="min-h-screen bg-white flex items-center justify-center">Book not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
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

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-full">
              {book.imagePath ? (
                <img src={`${API_BASE_URL}${book.imagePath}`} alt={book.title} className="max-h-96 object-contain" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FaBookOpen size={64} />
                  <p className="mt-2">Cover Image</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <div className="text-xl text-gray-600 mb-4">by {book.author}</div>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-gray-600">({reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold text-blue-600">${book.price}</span>
            </div>

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
                <div className="font-medium">${book.price}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex border border-gray-300 rounded-md">
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-l-md"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <div className="px-4 py-2 border-l border-r border-gray-300 min-w-16 text-center">{quantity}</div>
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-r-md"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>

              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 transition-colors">
                <FaShoppingCart /> Add to Cart
              </button>

              <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                <FaHeart className="text-red-500" />
              </button>
            </div>

            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full mr-2 ${book.inStock ? }"></div>
              <span>{book.inStock ? "In Stock" : "Out of Stock"}</span>
            </div>
          </div>
        </div>

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
                        <td className="py-3 font-medium">${book.price}</td>
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
                            className={`cursor-pointer ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
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
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                      disabled={submitLoading}
                    >
                      {submitLoading ? "Submitting..." : "Submit Review"}
                    </button>
                    {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
                    <button
                      type="button"
                      className="ml-4 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                )}

                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  reviews.map((review) => {
                    const reviewId = review.id || `review-${Math.random().toString(36).substr(2, 9)}`;
                    const reviewRating = review.rating || 0;
                    const reviewComment = review.comment || "";
                    const reviewDate = review.datePosted
                      ? new Date(review.datePosted).toLocaleDateString()
                      : "Invalid Date";
                    const userName = review.userName || "Anonymous";

                    return (
                      <div key={reviewId} className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                            {userName.charAt(0).toUpperCase()}
                            {userName.split(" ")[1]?.charAt(0).toUpperCase() || ""}
                          </div>
                          <div>
                            <div className="font-medium">{userName}</div>
                            <div className="text-sm text-gray-500">Verified Purchase</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < reviewRating ? "text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                        <h4 className="font-medium mb-2">
                          {reviewComment ? reviewComment.split("\n")[0] : "No comment provided"}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          {reviewComment ? reviewComment.split("\n").slice(1).join("\n") : ""}
                        </p>
                        <div className="text-sm text-gray-500">{reviewDate}</div>
                      </div>
                    );
                  })
                )}

                {reviews.length > 0 && (
                  <button className="text-blue-500 hover:text-blue-700 font-medium">Load More Reviews</button>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBooks.map((relatedBook) => (
              <div key={relatedBook.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <a href={`/books/${relatedBook.id}`}>
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {relatedBook.imagePath ? (
                      <img src={`${API_BASE_URL}${relatedBook.imagePath}`} alt={relatedBook.title} className="h-full w-full object-contain" />
                    ) : (
                      <FaBookOpen size={48} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{relatedBook.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{relatedBook.author}</p>
                    <div className="font-bold text-blue-600">${relatedBook.price}</div>
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