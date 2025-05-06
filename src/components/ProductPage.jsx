import { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaPhone } from "react-icons/fa";
import ProductCard, { FavoritesProvider } from "./ProductCard";

export default function ProductPage() {
  const [priceRange, setPriceRange] = useState(100);
  const [view, setView] = useState("grid");
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all books from the backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://localhost:7189/api/Auth/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const books = await response.json();
        // Map backend book data to match ProductCard props
        const formattedBooks = books.map((book) => ({
          id: book.id.toString(),
          title: book.title,
          author: book.author,
          price: book.price,
          imagePath: book.imagePath,
          id: book.id.toString(), // Convert to string to match ProductCard key type
          title: book.title,
          author: book.author,
          price: book.price,
          image: book.imagePath || "/api/placeholder/240/240", // Fallback image if none provided
        }));
        setAllProducts(formattedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        // Set empty array on error
        setAllProducts([]);
      }
    };

    fetchBooks();
  }, []);

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-white">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 p-6 border-r border-gray-200">
            <div className="mb-8">
              <h2 className="font-bold mb-4">Categories</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fiction</span>
                  <span className="text-gray-500">(12)</span>
                </div>
                <div className="flex justify-between">
                  <span>Non-Fiction</span>
                  <span className="text-gray-500">(8)</span>
                </div>
                <div className="flex justify-between">
                  <span>Science</span>
                  <span className="text-gray-500">(5)</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-bold mb-4">Price Range</h2>
              <div className="space-y-4">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between">
                  <span>$10</span>
                  <span>${priceRange}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-bold mb-4">Author</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="john-green" className="mr-2" />
                  <label htmlFor="john-green">John Green</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="jk-rowling" className="mr-2" />
                  <label htmlFor="jk-rowling">J.K. Rowling</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="george-martin" className="mr-2" />
                  <label htmlFor="george-martin">George R.R. Martin</label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* All Products */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">All Products</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm ${
                      view === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setView("grid")}
                  >
                    Grid View
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm ${
                      view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setView("list")}
                  >
                    List View
                  </button>
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Sort by:</span>
                  <select className="border border-gray-300 rounded p-1 text-sm">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {allProducts.map((book) => (
                  <ProductCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    price={book.price}
                    imagePath={book.imagePath}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-500 text-white">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300">
                    3
                  </button>
                  <button className="px-3 h-8 flex items-center justify-center rounded-md border border-gray-300">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FavoritesProvider>
  );
}
