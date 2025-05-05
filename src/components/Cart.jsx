import { useState, useEffect } from "react";
import { 
  FiShoppingCart, 
  FiMinus, 
  FiPlus, 
  FiX, 
  FiChevronLeft 
} from "react-icons/fi";
import Header from '../components/Header';
import Footer from '../components/Footer';

const ShoppingCart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
      price: 100,
      quantity: 2,
      image: "/api/placeholder/120/180",
    },
    {
      id: 2,
      title: "The Song of Achilles",
      author: "Madeline Miller",
      price: 120,
      quantity: 1,
      image: "/api/placeholder/120/180",
    },
    {
      id: 3,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      price: 150,
      quantity: 1,
      image: "/api/placeholder/120/180",
    }
  ]);

  const [animateTotal, setAnimateTotal] = useState(false);

  const updateQuantity = (id, change) => {
    setItems(
      items.map((item) =>
        item.id === id && item.quantity + change > 0
          ? { ...item, quantity: item.quantity + change }
          : item
      )
    );
    setAnimateTotal(true);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setAnimateTotal(true);
  };

  useEffect(() => {
    if (animateTotal) {
      const timer = setTimeout(() => setAnimateTotal(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateTotal]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? "Free" : 50;
  const total = typeof shipping === "number" ? subtotal + shipping : subtotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center mb-6 text-gray-500 hover:text-gray-800 transition-colors">
          <FiChevronLeft size={18} />
          <a href="#" className="ml-2 text-sm">Continue Shopping</a>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <FiShoppingCart className="mr-3" size={20} />
                  <h1 className="text-xl font-medium text-gray-800">Your Shopping Bag</h1>
                  <span className="ml-auto bg-gray-100 text-gray-800 font-medium text-sm py-1 px-3 rounded-full">
                    {items.length} Items
                  </span>
                </div>
              </div>

              <div className="px-6 py-3 border-b border-gray-100 hidden md:flex text-sm font-medium text-gray-500">
                <div className="w-2/5">Item</div>
                <div className="w-1/5 text-center">Price</div>
                <div className="w-1/5 text-center">Quantity</div>
                <div className="w-1/5 text-right">Total</div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="px-6 py-5 group">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex flex-1 md:w-2/5">
                        <div className="flex-shrink-0 rounded-md overflow-hidden shadow-sm">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-28 w-20 object-cover"
                          />
                        </div>
                        <div className="ml-4 flex flex-col justify-center">
                          <h3 className="text-base font-medium text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.author}</p>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="flex items-center mt-2 text-xs text-gray-400 hover:text-gray-600"
                          >
                            <FiX size={14} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="md:w-1/5 flex md:justify-center items-center mt-4 md:mt-0">
                        <span className="font-medium text-gray-800">₹{item.price}</span>
                      </div>

                      <div className="md:w-1/5 flex md:justify-center items-center mt-4 md:mt-0">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="md:w-1/5 flex md:justify-end items-center mt-4 md:mt-0">
                        <span className="font-medium text-gray-800">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 lg:w-80">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shipping === "Free" ? "text-gray-800 font-medium" : "font-medium"}>
                      {shipping === "Free" ? shipping : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-medium text-gray-800">Total</span>
                    <span className={`font-medium text-lg ${animateTotal ? "text-gray-600" : "text-gray-800"}`}>
                      ₹{total}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex">
                    <input 
                      type="text" 
                      className="flex-1 border border-gray-200 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="Coupon code"
                    />
                    <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-r-md font-medium text-sm hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 px-4 rounded-md bg-gray-800 hover:bg-gray-900 text-white font-medium transition-colors flex items-center justify-center">
                  <FiShoppingCart size={16} className="mr-2" />
                  Checkout
                </button>

                <div className="mt-5 flex items-center justify-center text-xs text-gray-500">
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ShoppingCart;