import React from 'react';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import ProductCard, { FavoritesProvider } from './ProductCard';

// Book data
const wishlistBooks = [
  {
    id: 1,
    title: "Floating Island",
    author: "John Verne",
    price: 18,
    image: "/api/placeholder/240/160"
  },
  {
    id: 2,
    title: "Mystery Forest",
    author: "Arthur Conan Doyle",
    price: 22,
    image: "/api/placeholder/240/160"
  },
  {
    id: 3,
    title: "Glass Castle",
    author: "George R.R. Martin",
    price: 30,
    image: "/api/placeholder/240/160"
  }
];





// Customer Service links
const customerServiceLinks = ["Help Center", "Returns", "Order Status", "Shipping Info"];

const Whishlist = () => {
  return (
    <FavoritesProvider>
      <div className="bg-gray-100 min-h-screen">
      
           
           

        {/* Main Content */}
        <main className="container mx-auto py-8 px-4">
          <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wishlistBooks.map((book) => (
              <div key={book.id} className="bg-white shadow-sm rounded overflow-hidden">
                <ProductCard
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  price={book.price}
                  image={book.image}
                />
                <div className="p-4 pt-0">
                  <button className="w-full bg-indigo-500 text-white rounded py-2 hover:bg-indigo-600 transition">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    </FavoritesProvider>
  );
};

export default Whishlist;