import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaBook,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaChevronRight,
} from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: "", message: "" });
    setIsSubmitting(true);

    const payload = {
      Name: formData.name,
      Email: formData.email,
      Subject: formData.subject,
      Message: formData.message,
    };

    try {
      const response = await fetch("https://localhost:7189/api/Contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      if (!response.ok) {
        let errorMessage = "Failed to submit contact form";
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const text = await response.text();
          console.error("Non-JSON Response:", text);
        }

        if (response.status === 400) {
          errorMessage = "Invalid form data. Please check your inputs.";
        } else if (response.status === 404) {
          errorMessage = "Contact endpoint not found. Please check the server.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      setFormStatus({ type: "success", message: result.message });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", {
        message: error.message,
        stack: error.stack,
      });
      setFormStatus({
        type: "error",
        message: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div>
  {/* Hero Section */}
  <div className="text-center py-12 bg-gray-100">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      We're here to help you with any questions, recommendations, or support
      you may need. Reach out to our friendly team today!
    </p>
  </div>

  {/* Contact Content */}
  <div className="container mx-36 max-w-screen-xl pb-16 pr-18">
    <div className="grid md:grid-cols-2 gap-12">
      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Contact Information
        </h2>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <FaMapMarkerAlt className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Our Bookstore</h3>
              <p className="text-gray-600">Balaju, Kathmandu, Nepal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <FaPhoneAlt className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Customer Support
              </h3>
              <p className="text-gray-600">+977 9827262555</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <FaEnvelope className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Email Support</h3>
              <p className="text-gray-600">support@bookhaven.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <FaBook className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Business Hours
              </h3>
              <p className="text-gray-600">Monday - Saturday: 10am - 8pm</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Connect with Us
          </h3>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-pink-600 hover:text-pink-700 transition duration-300"
            >
              <FaInstagram className="text-3xl" />
            </a>
            <a
              href="#"
              className="text-blue-700 hover:text-blue-800 transition duration-300"
            >
              <FaFacebook className="text-3xl" />
            </a>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-500 transition duration-300"
            >
              <FaTwitter className="text-3xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Send Us a Message
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="Enter the subject of your message"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              required
              disabled={isSubmitting}
              placeholder="Write your message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 resize-none"
            ></textarea>
          </div>

          {formStatus.message && (
            <div
              className={`text-center p-3 rounded-lg ${
                formStatus.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {formStatus.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            <FaChevronRight className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
  );
};

export default ContactUs;
