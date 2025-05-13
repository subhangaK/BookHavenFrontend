import { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaPhone } from "react-icons/fa";
import ProductCard, { FavoritesProvider } from "./ProductCard";
import { useSearchParams } from "react-router-dom";

export default function ProductPage() {
  const [priceRange, setPriceRange] = useState(100);
  const [view, setView] = useState("grid");
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [sortOption, setSortOption] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [yearRange, setYearRange] = useState({ min: 1900, max: 2025 });
  const [searchParams] = useSearchParams();
  const itemsPerPage = 8;

  const categories = [
    { name: "Fiction", count: 12 },
    { name: "Non-Fiction", count: 8 },
    { name: "Science", count: 5 },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://localhost:7189/api/Auth/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const books = await response.json();
        const formattedBooks = books.map((book) => ({
          id: book.id.toString(),
          title: book.title,
          author: book.author,
          price: book.price,
          imagePath: book.imagePath,
          category: book.category || assignRandomCategory(),
          publicationYear: book.publicationYear || 2020,
          isbn: book.isbn || "",
          isOnSale: book.isOnSale || false, // Map to isOnSale (boolean)
          discountPercentage: book.discountPercentage || 0, // Map to discountPercentage (number)
        }));

        setAllProducts(formattedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        setAllProducts([]);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams, selectedCategories, selectedAuthors, sortOption, priceRange, yearRange]);

  const assignRandomCategory = () => {
    const categoryNames = categories.map((c) => c.name);
    return categoryNames[Math.floor(Math.random() * categoryNames.length)];
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAuthorChange = (author) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleYearRangeChange = (field, value) => {
    setYearRange((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const searchQuery = searchParams.get("search") || "";

  const filteredProducts = allProducts
    .filter((book) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(book.category);
      const priceMatch = book.price <= priceRange;
      const authorMatch =
        selectedAuthors.length === 0 || selectedAuthors.includes(book.author);
      const yearMatch =
        book.publicationYear >= yearRange.min && book.publicationYear <= yearRange.max;
      let searchMatch = !searchQuery;
      if (searchQuery) {
        const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(word => word);
        const titleWords = book.title.toLowerCase();
        const authorWords = book.author.toLowerCase();
        const isbnWords = book.isbn.toLowerCase();
        searchMatch = queryWords.every((queryWord) => {
          const regex = new RegExp(`\\b${queryWord}\\b`, 'i');
          return regex.test(titleWords) || regex.test(authorWords) || regex.test(isbnWords);
        });
      }
      return categoryMatch && priceMatch && authorMatch && yearMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortOption === "Price: Low to High") {
        return a.price - b.price;
      } else if (sortOption === "Price: High to Low") {
        return b.price - b.price;
      }
      return 0;
    });

  const uniqueAuthors = [...new Set(allProducts.map((book) => book.author))];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-white">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 p-6 border-r border-gray-200">
            <div className="mb-8">
              <h2 className="font-bold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                    <span className="text-gray-500">({category.count})</span>
                  </div>
                ))}
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
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between">
                  <span>$10</span>
                  <span>${priceRange}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-bold mb-4">Publication Year</h2>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">From</label>
                    <input
                      type="number"
                      min="1900"
                      max={yearRange.max}
                      value={yearRange.min}
                      onChange={(e) => handleYearRangeChange("min", e.target.value)}
                      className="w-full border border-gray-300 rounded p-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">To</label>
                    <input
                      type="number"
                      min={yearRange.min}
                      max="2025"
                      value={yearRange.max}
                      onChange={(e) => handleYearRangeChange("max", e.target.value)}
                      className="w-full border border-gray-300 rounded p-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-bold mb-4">Author</h2>
              <div className="space-y-2">
                {uniqueAuthors.length > 0 ? (
                  uniqueAuthors.map((author) => (
                    <div key={author} className="flex items-center">
                      <input
                        type="checkbox"
                        id={author.replace(/\s+/g, '-').toLowerCase()}
                        checked={selectedAuthors.includes(author)}
                        onChange={() => handleAuthorChange(author)}
                        className="mr-2"
                      />
                      <label htmlFor={author.replace(/\s+/g, '-').toLowerCase()}>
                        {author}
                      </label>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center">
                      <input type="checkbox" id="john-green" className="mr-2" disabled />
                      <label htmlFor="john-green">John Green</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="jk-rowling" className="mr-2" disabled />
                      <label htmlFor="jk-rowling">J.K. Rowling</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="george-martin" className="mr-2" disabled />
                      <label htmlFor="george-martin">George R.R. Martin</label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
                </h2>
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
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded p-1 text-sm"
                  >
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div
                className={`${
                  view === "grid"
                    ? "grid grid-cols-1 md:grid-cols-4 gap-6"
                    : "flex flex-col gap-4"
                } mb-8`}
              >
                {currentProducts.length > 0 ? (
                  currentProducts.map((book) => (
                    <ProductCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      price={book.price}
                      imagePath={book.imagePath}
                      isOnSale={book.isOnSale} // Pass isOnSale
                      discountPercentage={book.discountPercentage} // Pass discountPercentage
                    />
                  ))
                ) : (
                  <p className="text-gray-500">
                    {searchQuery
                      ? `No products found for "${searchQuery}"`
                      : "No products match the selected filters."}
                  </p>
                )}
              </div>

              {totalPages > 0 && (
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 h-8 flex items-center justify-center rounded-md border border-gray-300 ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                      }`}
                    >
                      Previous
                    </button>
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 h-8 flex items-center justify-center rounded-md border border-gray-300 ${
                        currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FavoritesProvider>
  );
}