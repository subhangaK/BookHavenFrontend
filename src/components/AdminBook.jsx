import { useState, useEffect, useContext, memo } from "react";
import { FiPlus, FiBook, FiSearch, FiEdit, FiTrash2, FiX, FiUpload } from "react-icons/fi";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

// Memoized AddBookModal
const AddBookModal = memo(({ showAddModal, setShowAddModal, newBook, setNewBook, imagePreview, setImagePreview, addErrors, setAddErrors, handleInputChange, handleImageChange, handleAddBook }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30"></div>
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add New Book</h2>
        <button
          onClick={() => {
            setShowAddModal(false);
            setImagePreview("");
            setNewBook({
              title: "",
              author: "",
              isbn: "",
              publicationYear: "",
              price: "",
              description: "",
              category: "",
              image: null,
              isOnSale: false,
              discountPercentage: "",
              saleStartDate: "",
              saleEndDate: "",
            });
            setAddErrors({});
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Cover Image
          </label>
          <div className="flex items-center">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mr-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
                  <span className="text-sm text-gray-500">No image</span>
                </div>
              )}
            </div>
            <div>
              <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e)}
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={newBook.title}
            onChange={(e) => handleInputChange(e)}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addErrors.title ? "border-red-500" : ""
            }`}
            placeholder="Book title"
          />
          {addErrors.title && (
            <p className="text-red-500 text-xs mt-1">{addErrors.title}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={(e) => handleInputChange(e)}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addErrors.author ? "border-red-500" : ""
            }`}
            placeholder="Author name"
          />
          {addErrors.author && (
            <p className="text-red-500 text-xs mt-1">{addErrors.author}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            name="isbn"
            value={newBook.isbn}
            onChange={(e) => handleInputChange(e)}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addErrors.isbn ? "border-red-500" : ""
            }`}
            placeholder="Book ISBN"
          />
          {addErrors.isbn && (
            <p className="text-red-500 text-xs mt-1">{addErrors.isbn}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publication Year
          </label>
          <input
            type="number"
            name="publicationYear"
            value={newBook.publicationYear}
            onChange={(e) => handleInputChange(e)}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addErrors.publicationYear ? "border-red-500" : ""
            }`}
            placeholder="Publication year"
          />
          {addErrors.publicationYear && (
            <p className="text-red-500 text-xs mt-1">{addErrors.publicationYear}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={newBook.price}
            onChange={(e) => handleInputChange(e)}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addErrors.price ? "border-red-500" : ""
            }`}
            placeholder="Book price"
          />
          {addErrors.price && (
            <p className="text-red-500 text-xs mt-1">{addErrors.price}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={newBook.description}
            onChange={(e) => handleInputChange(e)}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addErrors.description ? "border-red-500" : ""
            }`}
            placeholder="Book description"
            rows="4"
          />
          {addErrors.description && (
            <p className="text-red-500 text-xs mt-1">{addErrors.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={newBook.category}
            onChange={(e) => handleInputChange(e)}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addErrors.category ? "border-red-500" : ""
            }`}
          >
            <option value="">Select category</option>
            <option value="Fiction">Fiction</option>
            <option value="Nonfiction">Nonfiction</option>
          </select>
          {addErrors.category && (
            <p className="text-red-500 text-xs mt-1">{addErrors.category}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <input
              type="checkbox"
              name="isOnSale"
              checked={newBook.isOnSale}
              onChange={(e) => handleInputChange(e)}
              className="mr-2"
            />
            On Sale
          </label>
        </div>
        {newBook.isOnSale && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={newBook.discountPercentage}
                onChange={(e) => handleInputChange(e)}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  addErrors.discountPercentage ? "border-red-500" : ""
                }`}
                placeholder="Discount %"
              />
              {addErrors.discountPercentage && (
                <p className="text-red-500 text-xs mt-1">{addErrors.discountPercentage}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sale Start Date
              </label>
              <input
                type="date"
                name="saleStartDate"
                value={newBook.saleStartDate}
                onChange={(e) => handleInputChange(e)}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  addErrors.saleStartDate ? "border-red-500" : ""
                }`}
              />
              {addErrors.saleStartDate && (
                <p className="text-red-500 text-xs mt-1">{addErrors.saleStartDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sale End Date
              </label>
              <input
                type="date"
                name="saleEndDate"
                value={newBook.saleEndDate}
                onChange={(e) => handleInputChange(e)}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  addErrors.saleEndDate ? "border-red-500" : ""
                }`}
              />
              {addErrors.saleEndDate && (
                <p className="text-red-500 text-xs mt-1">{addErrors.saleEndDate}</p>
              )}
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowAddModal(false)}
          className="mr-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleAddBook}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Book
        </button>
      </div>
    </div>
  </div>
));

// Memoized EditBookModal
const EditBookModal = memo(({ showEditModal, setShowEditModal, selectedBook, setSelectedBook, editImagePreview, setEditImagePreview, editErrors, setEditErrors, handleInputChange, handleImageChange, handleUpdateBook }) => {
  if (!selectedBook) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30"></div>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Book</h2>
          <button
            onClick={() => {
              setShowEditModal(false);
              setSelectedBook(null);
              setEditImagePreview("");
              setEditErrors({});
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Cover Image
            </label>
            <div className="flex items-center">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mr-4">
                {editImagePreview ? (
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
                    <span className="text-sm text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div>
                <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, true)}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={selectedBook.title}
              onChange={(e) => handleInputChange(e, true)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                editErrors.title ? "border-red-500" : ""
              }`}
              placeholder="Book title"
            />
            {editErrors.title && (
              <p className="text-red-500 text-xs mt-1">{editErrors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={selectedBook.author}
              onChange={(e) => handleInputChange(e, true)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                editErrors.author ? "border-red-500" : ""
              }`}
              placeholder="Author name"
            />
            {editErrors.author && (
              <p className="text-red-500 text-xs mt-1">{editErrors.author}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={selectedBook.isbn}
              onChange={(e) => handleInputChange(e, true)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                editErrors.isbn ? "border-red-500" : ""
              }`}
              placeholder="Book ISBN"
            />
            {editErrors.isbn && (
              <p className="text-red-500 text-xs mt-1">{editErrors.isbn}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year
            </label>
            <input
              type="number"
              name="publicationYear"
              value={selectedBook.publicationYear}
              onChange={(e) => handleInputChange(e, true)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                editErrors.publicationYear ? "border-red-500" : ""
              }`}
              placeholder="Publication year"
            />
            {editErrors.publicationYear && (
              <p className="text-red-500 text-xs mt-1">{editErrors.publicationYear}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={selectedBook.price}
              onChange={(e) => handleInputChange(e, true)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                editErrors.price ? "border-red-500" : ""
              }`}
              placeholder="Book price"
            />
            {editErrors.price && (
              <p className="text-red-500 text-xs mt-1">{editErrors.price}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={selectedBook.description}
              onChange={(e) => handleInputChange(e, true)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                editErrors.description ? "border-red-500" : ""
              }`}
              placeholder="Book description"
              rows="4"
            />
            {editErrors.description && (
              <p className="text-red-500 text-xs mt-1">{editErrors.description}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={selectedBook.category}
              onChange={(e) => handleInputChange(e, true)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                editErrors.category ? "border-red-500" : ""
              }`}
            >
              <option value="">Select category</option>
              <option value="Fiction">Fiction</option>
              <option value="Nonfiction">Nonfiction</option>
            </select>
            {editErrors.category && (
              <p className="text-red-500 text-xs mt-1">{editErrors.category}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                name="isOnSale"
                checked={selectedBook.isOnSale}
                onChange={(e) => handleInputChange(e, true)}
                className="mr-2"
              />
              On Sale
            </label>
          </div>
          {selectedBook.isOnSale && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={selectedBook.discountPercentage}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.discountPercentage ? "border-red-500" : ""
                  }`}
                  placeholder="Discount %"
                />
                {editErrors.discountPercentage && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.discountPercentage}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sale Start Date
                </label>
                <input
                  type="date"
                  name="saleStartDate"
                  value={selectedBook.saleStartDate}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.saleStartDate ? "border-red-500" : ""
                  }`}
                />
                {editErrors.saleStartDate && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.saleStartDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sale End Date
                </label>
                <input
                  type="date"
                  name="saleEndDate"
                  value={selectedBook.saleEndDate}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.saleEndDate ? "border-red-500" : ""
                  }`}
                />
                {editErrors.saleEndDate && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.saleEndDate}</p>
                )}
              </div>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowEditModal(false)}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateBook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
});

// Memoized DeleteConfirmationModal
const DeleteConfirmationModal = memo(({ showDeleteModal, setShowDeleteModal, bookToDelete, handleDeleteBook }) => {
  if (!bookToDelete) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30"></div>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiTrash2 className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Delete Book</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{bookToDelete.title}" by {bookToDelete.author}? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="mr-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteBook}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export default function BookAdminDashboard() {
  const { token } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
    price: "",
    description: "",
    category: "",
    image: null,
    isOnSale: false,
    discountPercentage: "",
    saleStartDate: "",
    saleEndDate: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://localhost:7189/api/Auth/books");
      const data = response.data;
      const mappedBooks = data.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publicationYear: book.publicationYear,
        price: book.price,
        description: book.description,
        category: book.category,
        imagePath: book.imagePath,
        isOnSale: book.isOnSale,
        discountPercentage: book.discountPercentage,
        saleStartDate: book.saleStartDate ? book.saleStartDate.split("T")[0] : "",
        saleEndDate: book.saleEndDate ? book.saleEndDate.split("T")[0] : "",
      }));
      setBooks(mappedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value, type, checked } = e.target;

    const newValue =
      type === "checkbox"
        ? checked
        : name === "publicationYear" || name === "price" || name === "discountPercentage"
        ? value === ""
          ? ""
          : parseFloat(value) || value
        : value;

    if (isEdit) {
      setSelectedBook((prev) => ({
        ...prev,
        [name]: newValue,
      }));
      setEditErrors((prev) => ({ ...prev, [name]: "" }));
    } else {
      setNewBook((prev) => ({
        ...prev,
        [name]: newValue,
      }));
      setAddErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (isEdit) {
      setEditImagePreview(previewUrl);
      setSelectedBook((prev) => ({
        ...prev,
        image: file,
      }));
    } else {
      setImagePreview(previewUrl);
      setNewBook((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const validateBook = (book) => {
    const errors = {};
    if (!book.title) errors.title = "Title is required";
    if (!book.author) errors.author = "Author is required";

    if (!book.isbn) {
      errors.isbn = "ISBN is required";
    } else {
      const isbnPattern = /^(?:\d{10}|\d{13}|\d{1,5}-\d{1,7}-\d{1,7}-\d{1})$/;
      if (!isbnPattern.test(book.isbn.replace(/-/g, ""))) {
        errors.isbn = "ISBN must be 10 or 13 digits (hyphens allowed)";
      }
    }

    if (!book.publicationYear) {
      errors.publicationYear = "Publication year is required";
    } else if (
      isNaN(book.publicationYear) ||
      book.publicationYear < 1800 ||
      book.publicationYear > 2025
    ) {
      errors.publicationYear = "Year must be between 1800 and 2025";
    }

    if (!book.price) {
      errors.price = "Price is required";
    } else if (isNaN(book.price) || book.price <= 0) {
      errors.price = "Price must be a positive number";
    }

    if (!book.description) errors.description = "Description is required";
    if (!book.category) errors.category = "Category is required";

    if (book.isOnSale) {
      if (!book.discountPercentage) {
        errors.discountPercentage = "Discount percentage is required";
      } else if (isNaN(book.discountPercentage) || book.discountPercentage <= 0 || book.discountPercentage > 100) {
        errors.discountPercentage = "Discount must be between 1 and 100";
      }

      if (!book.saleStartDate) {
        errors.saleStartDate = "Sale start date is required";
      }

      if (!book.saleEndDate) {
        errors.saleEndDate = "Sale end date is required";
      } else if (book.saleStartDate && new Date(book.saleEndDate) <= new Date(book.saleStartDate)) {
        errors.saleEndDate = "Sale end date must be after start date";
      }
    }

    return errors;
  };

 const handleAddBook = async () => {
  const errors = validateBook(newBook);
  if (Object.keys(errors).length > 0) {
    setAddErrors(errors);
    toast.error("Please fix the errors before submitting.", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  const formData = new FormData();
  formData.append("Title", newBook.title);
  formData.append("Author", newBook.author);
  formData.append("ISBN", newBook.isbn);
  formData.append("Price", newBook.price.toString());
  formData.append("PublicationYear", newBook.publicationYear.toString());
  formData.append("Description", newBook.description);
  formData.append("Category", newBook.category);
  formData.append("IsOnSale", newBook.isOnSale.toString());
  if (newBook.isOnSale) {
    formData.append("DiscountPercentage", newBook.discountPercentage.toString());
    formData.append("SaleStartDate", new Date(newBook.saleStartDate).toISOString());
    formData.append("SaleEndDate", new Date(newBook.saleEndDate).toISOString());
  }
  if (newBook.image) {
    formData.append("Image", newBook.image);
  }

  try {
    const response = await axios.post(
      "https://localhost:7189/api/Auth/books",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const addedBook = response.data;
    setBooks([
      ...books,
      {
        id: addedBook.id,
        title: addedBook.title,
        author: addedBook.author,
        isbn: addedBook.isbn,
        publicationYear: addedBook.publicationYear,
        price: addedBook.price,
        description: addedBook.description,
        category: addedBook.category,
        imagePath: addedBook.imagePath,
        isOnSale: addedBook.isOnSale,
        discountPercentage: addedBook.discountPercentage,
        saleStartDate: addedBook.saleStartDate ? addedBook.saleStartDate.split("T")[0] : "",
        saleEndDate: addedBook.saleEndDate ? addedBook.saleEndDate.split("T")[0] : "",
      },
    ]);
    setNewBook({
      title: "",
      author: "",
      isbn: "",
      publicationYear: "",
      price: "",
      description: "",
      category: "",
      image: null,
      isOnSale: false,
      discountPercentage: "",
      saleStartDate: "",
      saleEndDate: "",
    });
    setImagePreview("");
    setShowAddModal(false);
    setAddErrors({});
    toast.success("Book added successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    const errorMessage = error.response?.data?.errors?.[0]?.description || "Failed to add book. Please try again.";
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

const handleUpdateBook = async () => {
  const errors = validateBook(selectedBook);
  if (Object.keys(errors).length > 0) {
    setEditErrors(errors);
    toast.error("Please fix the errors before submitting.", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  const formData = new FormData();
  formData.append("Title", selectedBook.title);
  formData.append("Author", selectedBook.author);
  formData.append("ISBN", selectedBook.isbn);
  formData.append("Price", selectedBook.price.toString());
  formData.append("PublicationYear", selectedBook.publicationYear.toString());
  formData.append("Description", selectedBook.description);
  formData.append("Category", selectedBook.category);
  formData.append("IsOnSale", selectedBook.isOnSale.toString());
  if (selectedBook.isOnSale) {
    formData.append("DiscountPercentage", selectedBook.discountPercentage.toString());
    formData.append("SaleStartDate", new Date(selectedBook.saleStartDate).toISOString());
    formData.append("SaleEndDate", new Date(selectedBook.saleEndDate).toISOString());
  }
  if (selectedBook.image) {
    formData.append("Image", selectedBook.image);
  }

  try {
    const response = await axios.post(
      `https://localhost:7189/api/Auth/books/${selectedBook.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const updatedBook = response.data;
    setBooks(
      books.map((book) =>
        book.id === selectedBook.id
          ? {
              id: updatedBook.id,
              title: updatedBook.title,
              author: updatedBook.author,
              isbn: updatedBook.isbn,
              publicationYear: updatedBook.publicationYear,
              price: updatedBook.price,
              description: updatedBook.description,
              category: updatedBook.category,
              imagePath: updatedBook.imagePath,
              isOnSale: updatedBook.isOnSale,
              discountPercentage: updatedBook.discountPercentage,
              saleStartDate: updatedBook.saleStartDate ? updatedBook.saleStartDate.split("T")[0] : "",
              saleEndDate: updatedBook.saleEndDate ? updatedBook.saleEndDate.split("T")[0] : "",
            }
          : book
      )
    );
    setSelectedBook(null);
    setEditImagePreview("");
    setShowEditModal(false);
    setEditErrors({});
    toast.success("Book updated successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    const errorMessage = error.response?.data?.errors?.[0]?.description || "Failed to update book. Please try again.";
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
    });
  }
};
  const handleDeleteBook = async () => {
    try {
      await axios.delete(
        `https://localhost:7189/api/Auth/books/${bookToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(books.filter((book) => book.id !== bookToDelete.id));
      setBookToDelete(null);
      setShowDeleteModal(false);
      toast.success("Book deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const openEditModal = (book) => {
    setSelectedBook({
      ...book,
      image: null,
      saleStartDate: book.saleStartDate || "",
      saleEndDate: book.saleEndDate || "",
    });
    setEditImagePreview(book.imagePath ? `https://localhost:7189${book.imagePath}` : "");
    setShowEditModal(true);
    setEditErrors({});
  };

  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FiBook className="mr-2" /> Book Admin Dashboard
          </h1>
        </header>

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          >
            <FiPlus className="mr-2" /> Add New Book
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {book.imagePath ? (
                        <img
                          src={`https://localhost:7189${book.imagePath}`}
                          alt={book.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">{book.title}</td>
                    <td className="px-6 py-4">{book.author}</td>
                    <td className="px-6 py-4">{book.isbn}</td>
                    <td className="px-6 py-4">{book.publicationYear}</td>
                    <td className="px-6 py-4">
                      {book.isOnSale ? (
                        <span>
                          <span className="line-through text-gray-500 mr-2">${book.price}</span>
                          ${(
                            book.price -
                            (book.price * book.discountPercentage) / 100
                          ).toFixed(2)}
                        </span>
                      ) : (
                        `$${book.price}`
                      )}
                    </td>
                    <td className="px-6 py-4">{book.category}</td>
                    <td className="px-6 py-4">
                      {book.isOnSale ? (
                        <span className="text-green-600">
                          On Sale ({book.discountPercentage}% off)
                        </span>
                      ) : (
                        <span className="text-gray-500">Not on Sale</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(book)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(book)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No books found. Add a new book or try a different search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-gray-500 text-sm">
          Showing {filteredBooks.length} of {books.length} books
        </div>
      </div>

      {showAddModal && (
        <AddBookModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newBook={newBook}
          setNewBook={setNewBook}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          addErrors={addErrors}
          setAddErrors={setAddErrors}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          handleAddBook={handleAddBook}
        />
      )}
      {showEditModal && (
        <EditBookModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          editImagePreview={editImagePreview}
          setEditImagePreview={setEditImagePreview}
          editErrors={editErrors}
          setEditErrors={setEditErrors}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          handleUpdateBook={handleUpdateBook}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          bookToDelete={bookToDelete}
          handleDeleteBook={handleDeleteBook}
        />
      )}
    </div>
  );
}