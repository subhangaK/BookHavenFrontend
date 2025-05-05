import { useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaUser, FaBook, FaHistory, FaHeart, FaBookmark, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function LibraryUserProfile() {
  const [activeTab, setActiveTab] = useState("borrowed");
  
  const user = {
    name: "Alexandria Reader",
    email: "alexandria@example.com",
    phone: "(555) 123-4567",
    address: "123 Bookworm Lane, Libraryville",
    avatar: "/api/placeholder/150/150",
    memberSince: "May 2020",
    borrowedBooks: [
      { id: 1, title: "The Midnight Library", author: "Matt Haig", dueDate: "May 15, 2025", coverImg: "/api/placeholder/60/90" },
      { id: 2, title: "Project Hail Mary", author: "Andy Weir", dueDate: "May 10, 2025", coverImg: "/api/placeholder/60/90" }
    ],
    reservedBooks: [
      { id: 3, title: "Lessons in Chemistry", author: "Bonnie Garmus", availableDate: "May 7, 2025", coverImg: "/api/placeholder/60/90" }
    ],
    readingHistory: [
      { id: 4, title: "Dune", author: "Frank Herbert", returnDate: "April 20, 2025", coverImg: "/api/placeholder/60/90" },
      { id: 5, title: "The Night Circus", author: "Erin Morgenstern", returnDate: "April 5, 2025", coverImg: "/api/placeholder/60/90" },
      { id: 6, title: "Pachinko", author: "Min Jin Lee", returnDate: "March 22, 2025", coverImg: "/api/placeholder/60/90" }
    ],
    savedBooks: [
      { id: 7, title: "Cloud Cuckoo Land", author: "Anthony Doerr", coverImg: "/api/placeholder/60/90" },
      { id: 8, title: "The Three-Body Problem", author: "Liu Cixin", coverImg: "/api/placeholder/60/90" }
    ],
    notifications: [
      { id: 1, message: "Your reserved book 'Lessons in Chemistry' will be available soon", date: "1 day ago" },
      { id: 2, message: "'The Midnight Library' is due in 10 days", date: "2 days ago" }
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "borrowed":
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Currently Borrowed Books</h3>
            {user.borrowedBooks.length === 0 ? (
              <p className="text-gray-500">You don't have any borrowed books.</p>
            ) : (
              <div className="space-y-4">
                {user.borrowedBooks.map(book => (
                  <div key={book.id} className="flex bg-white rounded-lg shadow p-4">
                    <img src={book.coverImg} alt={book.title} className="w-16 h-24 rounded" />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-indigo-800">{book.title}</h4>
                      <p className="text-gray-600">{book.author}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-orange-600">Due: {book.dueDate}</p>
                        <button className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded">
                          Renew
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Reserved Books</h3>
              {user.reservedBooks.length === 0 ? (
                <p className="text-gray-500">You don't have any reserved books.</p>
              ) : (
                <div className="space-y-4">
                  {user.reservedBooks.map(book => (
                    <div key={book.id} className="flex bg-white rounded-lg shadow p-4">
                      <img src={book.coverImg} alt={book.title} className="w-16 h-24 rounded" />
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-indigo-800">{book.title}</h4>
                        <p className="text-gray-600">{book.author}</p>
                        <p className="text-sm text-green-600 mt-2">Available: {book.availableDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "history":
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Reading History</h3>
            {user.readingHistory.length === 0 ? (
              <p className="text-gray-500">Your reading history is empty.</p>
            ) : (
              <div className="space-y-4">
                {user.readingHistory.map(book => (
                  <div key={book.id} className="flex bg-white rounded-lg shadow p-4">
                    <img src={book.coverImg} alt={book.title} className="w-16 h-24 rounded" />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-indigo-800">{book.title}</h4>
                      <p className="text-gray-600">{book.author}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-500">Returned: {book.returnDate}</p>
                        <button className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded">
                          Borrow Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "saved":
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Saved Books</h3>
            {user.savedBooks.length === 0 ? (
              <p className="text-gray-500">You don't have any saved books.</p>
            ) : (
              <div className="space-y-4">
                {user.savedBooks.map(book => (
                  <div key={book.id} className="flex bg-white rounded-lg shadow p-4">
                    <img src={book.coverImg} alt={book.title} className="w-16 h-24 rounded" />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-indigo-800">{book.title}</h4>
                      <p className="text-gray-600">{book.author}</p>
                      <div className="flex justify-between items-center mt-2">
                        <button className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded">
                          Check Availability
                        </button>
                        <button className="text-sm text-red-500 hover:text-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "notifications":
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            {user.notifications.length === 0 ? (
              <p className="text-gray-500">You don't have any notifications.</p>
            ) : (
              <div className="space-y-4">
                {user.notifications.map(notification => (
                  <div key={notification.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between">
                      <p>{notification.message}</p>
                      <span className="text-xs text-gray-500">{notification.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={user.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={user.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={user.phone}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={user.address}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification Preferences</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                        Email notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sms-notifications"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="sms-notifications" className="ml-2 text-sm text-gray-700">
                        SMS notifications
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with background */}
          <div className="bg-gradient-to-r from-indigo-700 to-purple-600 h-40 relative">
            <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex px-6">
              <div className="h-32 w-32 rounded-full ring-4 ring-white bg-white overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-6 pt-2">
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-indigo-100">Member since {user.memberSince}</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col md:flex-row mt-16 pt-4">
            {/* Sidebar */}
            <div className="md:w-64 p-6 border-r border-gray-200">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("borrowed")}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === "borrowed"
                      ? "bg-indigo-100 text-indigo-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaBook className="mr-3" />
                  <span>My Books</span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === "history"
                      ? "bg-indigo-100 text-indigo-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaHistory className="mr-3" />
                  <span>Reading History</span>
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === "saved"
                      ? "bg-indigo-100 text-indigo-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaHeart className="mr-3" />
                  <span>Saved Books</span>
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === "notifications"
                      ? "bg-indigo-100 text-indigo-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaBell className="mr-3" />
                  <span>Notifications</span>
                  {user.notifications.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {user.notifications.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-indigo-100 text-indigo-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaCog className="mr-3" />
                  <span>Settings</span>
                </button>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPhone className="mr-2 text-gray-500" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    <span>{user.address}</span>
                  </div>
                </div>

                <button className="mt-8 flex items-center text-red-600 hover:text-red-800 text-sm font-medium">
                  <FaSignOutAlt className="mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 p-6">{renderTabContent()}</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}