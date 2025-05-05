import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaBell } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">BookHaven</h3>
            <p className="text-gray-400 mb-6">Your ultimate destination for books of all genres. Discover, read, and share your love for literature.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <div className="bg-gray-700 hover:bg-blue-600 p-2 rounded-full">
                  <FaFacebookF />
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <div className="bg-gray-700 hover:bg-blue-400 p-2 rounded-full">
                  <FaTwitter />
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <div className="bg-gray-700 hover:bg-pink-600 p-2 rounded-full">
                  <FaInstagram />
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <div className="bg-gray-700 hover:bg-red-600 p-2 rounded-full">
                  <FaPinterestP />
                </div>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">Categories</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Fiction & Literature</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Science & Technology</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">History & Biography</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Business & Finance</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Children's Books</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to get special offers, free giveaways, and new arrivals.</p>
            <div className="flex mb-4">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition duration-300">
                <FaBell />
              </button>
            </div>
            <p className="text-gray-500 text-sm">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400 text-sm">
          <p>© 2025 BookHaven. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for book lovers worldwide</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;