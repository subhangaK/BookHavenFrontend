import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaPlus, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';

const AdminBanner = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    message: '',
    startTime: '',
    endTime: '',
    isActive: false,
    isDeleted: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Fetch all banners on component mount or when showArchived changes
  useEffect(() => {
    fetchBanners();
  }, [showArchived]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('https://localhost:7189/api/Banner', {
        params: { showDeleted: showArchived },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
      setBanners(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch banners');
      console.error('Fetch banners error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate dates
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    if (isNaN(startTime) || isNaN(endTime)) {
      setError('Invalid date format');
      return;
    }
    if (endTime <= startTime) {
      setError('End time must be after start time');
      return;
    }

    // Validate message
    if (!formData.message || formData.message.trim() === '') {
      setError('Message is required');
      return;
    }

    // Prepare payload with ISO 8601 formatted dates
    const payload = {
      message: formData.message,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isActive: formData.isActive,
      isDeleted: formData.isDeleted,
    };

    // Only include id for PUT requests
    if (isEditing && formData.id) {
      payload.id = formData.id;
    }

    console.log('Submit payload:', payload); // Debug payload

    try {
      if (isEditing) {
        // Update existing banner
        await axios.put(`https://localhost:7189/api/Banner/${formData.id}`, payload, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        });
        setSuccessMessage('Banner updated successfully');
      } else {
        // Create new banner
        await axios.post('https://localhost:7189/api/Banner', payload, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        });
        setSuccessMessage('Banner created successfully');
      }
      resetForm();
      fetchBanners();
    } catch (err) {
      const errorMessage = err.response?.data?.title || err.response?.data?.message || err.message || 'Failed to save banner';
      setError(errorMessage);
      console.error('Submit error details:', err.response?.data);
    }
  };

  const handleEdit = (banner) => {
    setFormData({
      id: banner.id,
      message: banner.message,
      startTime: new Date(banner.startTime).toISOString().slice(0, 16),
      endTime: new Date(banner.endTime).toISOString().slice(0, 16),
      isActive: banner.isActive,
      isDeleted: banner.isDeleted,
    });
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive this banner?')) {
      try {
        // Fetch the current banner data to preserve existing values
        const response = await axios.get(`https://localhost:7189/api/Banner/${id}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        });
        const banner = response.data;

        // Validate fetched data
        if (!banner.message || !banner.startTime || !banner.endTime) {
          setError('Invalid banner data fetched');
          return;
        }

        const startTime = new Date(banner.startTime);
        const endTime = new Date(banner.endTime);
        if (isNaN(startTime) || isNaN(endTime) || endTime <= startTime) {
          setError('Invalid date data in banner');
          return;
        }

        // Prepare payload with isDeleted set to true
        const payload = {
          id: banner.id,
          message: banner.message,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          isActive: banner.isActive,
          isDeleted: true
        };

        console.log('Delete payload:', payload); // Debug payload

        // Send PUT request to update isDeleted
        await axios.put(`https://localhost:7189/api/Banner/${id}`, payload, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        });
        fetchBanners();
        setSuccessMessage('Banner archived successfully');
      } catch (err) {
        const errorMessage = err.response?.data?.title || err.response?.data?.message || err.message || 'Failed to archive banner';
        setError(errorMessage);
        console.error('Delete error details:', err.response?.data);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      message: '',
      startTime: '',
      endTime: '',
      isActive: false,
      isDeleted: false,
    });
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-extrabold mb-2 flex items-center">
          <FaPlus className="mr-3 w-8 h-8" />
          Banner Management
        </h1>
        <p className="text-indigo-100">Create, update, and manage site-wide banners</p>
      </div>

      {/* Banner Form */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-b-lg shadow-2xl border-t-4 border-indigo-600 transition-all duration-300 hover:shadow-xl"
      >
        {/* Error and Success Messages */}
        {error && (
          <div className="flex items-center bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4 animate-pulse">
            <FaRegTimesCircle className="mr-3 w-6 h-6" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-center bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg mb-4">
            <FaRegCheckCircle className="mr-3 w-6 h-6" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out"
              rows="4"
              placeholder="Enter banner message..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out"
            />
          </div>

          <div className="md:col-span-2 flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
              />
              <label className="text-sm text-gray-700">Active Banner</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDeleted"
                checked={formData.isDeleted}
                onChange={handleInputChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
              />
              <label className="text-sm text-gray-700">Archived</label>
            </div>
          </div>

          <div className="md:col-span-2 flex space-x-4">
            <button
              type="submit"
              className="flex items-center justify-center w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 group"
            >
              {isEditing ? (
                <>
                  <FaEdit className="mr-2 w-5 h-5 group-hover:animate-pulse" />
                  Update Banner
                </>
              ) : (
                <>
                  <FaPlus className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                  Create Banner
                </>
              )}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Banners Table */}
      <div className="mt-8 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Existing Banners</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
            />
            <label className="text-sm text-gray-700">Show Archived Banners</label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {['Message', 'Start Time', 'End Time', 'Active', 'Archived', 'Actions'].map((header) => (
                  <th 
                    key={header} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(banners) && banners.length > 0 ? (
                banners.map((banner) => (
                  <tr 
                    key={banner.id} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {banner.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(banner.startTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(banner.endTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          banner.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          banner.isDeleted 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {banner.isDeleted ? 'Archived' : 'Not Archived'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200 hover:scale-110"
                        title="Edit Banner"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200 hover:scale-110"
                        title="Archive Banner"
                      >
                        <FaTrashAlt className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No banners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBanner;