import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";

export default function ItemDetails() {
  const { id } = useParams(); // Get book ID from URL
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure API base URL
  const API_BASE_URL = "https://localhost:7189/"; // Backend URL

  // Fetch book details and related books
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Validate id
        if (!id || id === "undefined") {
          throw new Error("Invalid or missing book ID. Please select a book.");
        }

        setLoading(true);

        // Fetch book details
        const bookResponse = await fetch(`${API_BASE_URL}api/auth/books/${id}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!bookResponse.ok) {
          const text = await bookResponse.text();
          console.error(`Book API error: Status ${bookResponse.status}, Response: ${text}`);
          throw new Error(`Failed to fetch book details: ${bookResponse.status} ${bookResponse.statusText}`);
        }

        let bookData;
        try {
          bookData = await bookResponse.json();
        } catch (jsonError) {
          const text = await bookResponse.text();
          console.error(`Book API JSON parse error: ${jsonError.message}, Response: ${text}`);
          throw new Error("Invalid JSON response from book API");
        }

        setBook({
          ...bookData,
          description: bookData.description || "No description available.",
          longDescription: bookData.longDescription || "No additional details available.",
          inStock: bookData.price > 0, // Assuming price > 0 means in stock
          reviewCount: 24, // Static for now, as backend doesn't provide reviews
        });

        // Fetch related books
        const booksResponse = await fetch(`${API_BASE_URL}api/auth/books`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!booksResponse.ok) {
          const text = await booksResponse.text();
          console.error(`Books API error: Status ${booksResponse.status}, Response: ${text}`);
          throw new Error(`Failed to fetch related books: ${booksResponse.status} ${booksResponse.statusText}`);
        }

        let booksData;
        try {
          booksData = await booksResponse.json();
        } catch (jsonError) {
          const text = await booksResponse.text();
          console.error(`Books API JSON parse error: ${jsonError.message}, Response: ${text}`);
          throw new Error("Invalid JSON response from books API");
        }

        // Filter out current book and limit to 4
        const filteredBooks = booksData
          .filter((b) => b.id !== bookData.id)
          .slice(0, 4)
          .map((b) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            price: b.price,
            imagePath: b.imagePath,
          }));
        setRelatedBooks(filteredBooks);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Error: {error || "Book not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-blue-500">Home</a>
          <span className="mx-2">/</span>
          <a href="/books" className="hover:text-blue-500">Books</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{book.title}</span>
        </div>

        {/* Back button */}
        <a href="/books" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6">
          <FaArrowLeft className="mr-2" /> Back to Books
        </a>

        {/* Book details section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Book image */}
          <div className="md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-full">
              {book.imagePath ? (
                <img
                  src={`${API_BASE_URL}${book.imagePath}`}
                  alt={book.title}
                  className="max-h-96 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FaBookOpen size={64} />
                  <p className="mt-2">Cover Image</p>
                </div>
              )}
            </div>
          </div>

          {/* Book info */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <div className="text-xl text-gray-600 mb-4">by {book.author}</div>

            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-gray-600">(24 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold text-blue-600">${book.price}</span>
            </div>

            {/* Quick details */}
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
                <div className="font-medium">{book.price}</div>
              </div>
            </div>

            {/* Add to cart section */}
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
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button
                className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <FaHeart className="text-red-500" />
              </button>
            </div>

            {/* Availability */}
            <div className="flex items-center text-sm">
              <div className={`w-3 h-3 rounded-full mr-2 ${book.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
              <span>{book.inStock ? "In Stock" : "Out of Stock"}</span>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mb-12">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "description"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "details"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Additional Details
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({book.reviewCount})
            </button>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {book.description}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {book.longDescription}
                </p>
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
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                    Write a Review
                  </button>
                </div>

                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                      JD
                    </div>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-gray-500">Verified Purchase</div>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < 5 ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <h4 className="font-medium mb-2">Absolutely wonderful read!</h4>
                  <p className="text-gray-600 mb-2">
                    This book exceeded all my expectations. The characters were well-developed and the plot kept
                    me engaged from start to finish. I highly recommend this to anyone who enjoys this genre.
                  </p>
                  <div className="text-sm text-gray-500">Reviewed on April 12, 2025</div>
                </div>

                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold mr-3">
                      AS
                    </div>
                    <div>
                      <div className="font-medium">Alice Smith</div>
                      <div className="text-sm text-gray-500">Verified Purchase</div>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <h4 className="font-medium mb-2">Great story, but could be better</h4>
                  <p className="text-gray-600 mb-2">
                    I enjoyed the author's writing style and the overall premise. However, I felt that some parts of the
                    story were a bit predictable. Still, it was a good read and I look forward to more from this author.
                  </p>
                  <div className="text-sm text-gray-500">Reviewed on March 28, 2025</div>
                </div>

                <button className="text-blue-500 hover:text-blue-700 font-medium">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related books section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBooks.map((relatedBook) => (
              <div key={relatedBook.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <a href={`/books/${relatedBook.id}`}>
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {relatedBook.imagePath ? (
                      <img
                        src={`${API_BASE_URL}${relatedBook.imagePath}`}
                        alt={relatedBook.title}
                        className="h-full w-full object-contain"
                      />
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