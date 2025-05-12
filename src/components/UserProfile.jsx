import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaBook, 
  FaHeart, 
  FaSignOutAlt, 
  FaCamera, 
  FaEdit, 
  FaCalendarAlt, 
  FaBookmark, 
  FaShoppingBag, 
  FaHistory, 
  FaDollarSign,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  const API_BASE_URL = "https://localhost:7189/";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}api/User/profile`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data = await response.json();
        setUserData(data);
        setNewUsername(data.userName);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUsernameUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/User/update-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });
      if (!response.ok) {
        throw new Error("Failed to update username.");
      }
      setUserData({ ...userData, userName: newUsername });
      setEditUsername(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}api/User/upload-profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload profile picture.");
      }
      const data = await response.json();
      setUserData({ ...userData, profilePicture: data.profilePicture });
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => navigate("/login")} 
            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <FaUser className="mx-auto text-gray-400 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">User not found</h2>
          <p className="text-gray-500 mt-2">We couldn't find your profile information</p>
          <button 
            onClick={() => navigate("/login")} 
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-48 sm:h-56 relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={handleSignOut}
                className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-red px-4 py-2 rounded-full transition duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="absolute -bottom-16 sm:-bottom-20 left-0 w-full flex px-6 sm:px-10">
              <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-lg">
                <img
                  src={userData.profilePicture ? `${API_BASE_URL}${userData.profilePicture}` : "/api/placeholder/150/150"}
                  alt={userData.userName}
                  className="h-full w-full object-cover"
                />
                <label className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-md transition duration-200">
                  <FaCamera className="text-lg" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                  />
                </label>
              </div>
              
              <div className="ml-6 pt-4 mb-22 sm:pt-8">
                {editUsername ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="text-2xl font-bold text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-indigo-200 transition duration-200"
                      autoFocus
                    />
                    <button
                      onClick={handleUsernameUpdate}
                      className="ml-4 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md shadow-sm transition duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditUsername(false);
                        setNewUsername(userData.userName);
                      }}
                      className="ml-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md shadow-sm transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{userData.userName}</h2>
                    <button
                      onClick={() => setEditUsername(true)}
                      className="ml-3 text-white hover:text-indigo-200 transition duration-200"
                      aria-label="Edit username"
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}
                <p className="text-indigo-100 flex items-center mt-1">
                  <FaUser className="mr-2" />
                  {userData.email}
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="mt-20 sm:mt-24 px-6 pb-8">
            {/* Tabs */}
            <div className="border-b border-gray-200 mt-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center pb-4 px-1 ${
                    activeTab === "orders"
                      ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                      : "text-gray-500 hover:text-indigo-500 hover:border-indigo-300 hover:border-b-2"
                  } transition-all duration-200`}
                >
                  <FaShoppingBag className="mr-2" />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`flex items-center pb-4 px-1 ${
                    activeTab === "wishlist"
                      ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                      : "text-gray-500 hover:text-indigo-500 hover:border-indigo-300 hover:border-b-2"
                  } transition-all duration-200`}
                >
                  <FaHeart className="mr-2" />
                  My Wishlist
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === "orders" && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                      <FaShoppingBag className="mr-2 text-indigo-600" />
                      Your Book Orders
                    </h3>
                    <div className="text-sm text-gray-500">
                      {userData.orders.length} {userData.orders.length === 1 ? "Book" : "Books"}
                    </div>
                  </div>
                  
                  {userData.orders.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <FaBook className="mx-auto text-4xl text-gray-300 mb-3" />
                      <h4 className="text-lg font-medium text-gray-700">Your bookshelf is empty</h4>
                      <p className="text-gray-500 mt-2">You haven't ordered any books yet.</p>
                      <button 
                        onClick={() => navigate("/ProductPage")} 
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
                      >
                        Browse Books
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userData.orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                          <div className="h-40 bg-gray-100 overflow-hidden relative">
                            <img
                              src={order.imagePath ? `${API_BASE_URL}${order.imagePath}` : "/api/placeholder/400/250"}
                              alt={order.title}
                              className="w-full h-full object-cover"
                            />
                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "Purchased" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.status === "Purchased" ? (
                                <div className="flex items-center">
                                  <FaCheckCircle className="mr-1" />
                                  {order.status}
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <FaClock className="mr-1" />
                                  {order.status}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-lg text-indigo-800 line-clamp-1">{order.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{order.author}</p>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center text-indigo-600 font-medium">
                                <FaDollarSign className="mr-1" />
                                {order.price.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <FaCalendarAlt className="mr-1" />
                                {formatDate(order.dateAdded)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                      <FaHeart className="mr-2 text-pink-500" />
                      Your Wishlist
                    </h3>
                    <div className="text-sm text-gray-500">
                      {userData.wishlists.length} {userData.wishlists.length === 1 ? "Book" : "Books"}
                    </div>
                  </div>
                  
                  {userData.wishlists.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <FaHeart className="mx-auto text-4xl text-gray-300 mb-3" />
                      <h4 className="text-lg font-medium text-gray-700">Your wishlist is empty</h4>
                      <p className="text-gray-500 mt-2">Discover books you'd love to read next.</p>
                      <button 
                        onClick={() => navigate("/ProductPages")} 
                        className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
                      >
                        Discover Books
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userData.wishlists.map(wishlist => (
                        <div key={wishlist.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 group">
                          <div className="h-40 bg-gray-100 overflow-hidden relative">
                            <img
                              src={wishlist.imagePath ? `${API_BASE_URL}${wishlist.imagePath}` : "/api/placeholder/400/250"}
                              alt={wishlist.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition duration-200">
                                <FaShoppingBag />
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-lg text-indigo-800 line-clamp-1">{wishlist.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{wishlist.author}</p>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center text-indigo-600 font-medium">
                                <FaDollarSign className="mr-1" />
                                {wishlist.price.toFixed(2)}
                              </div>
                              <button className="text-pink-500 hover:text-pink-600 transition duration-200">
                                <FaHeart />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}