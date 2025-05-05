import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import Register from "../assets/Register.jpg";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-4xl">
        <div className="w-full md:w-1/2 p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold text-center text-blue-700">
            Welcome to Book Haven
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Let's create your account and set you all up.
          </p>

          <div className="flex gap-3 mb-4 w-full">
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                placeholder="Your first name"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Your last name"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>

          <div className="mb-4 w-full">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full p-2 border rounded text-sm"
            />
          </div>

          <div className="mb-4 relative w-full">
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 border rounded text-sm"
            />
            <span className="absolute right-3 top-9 text-gray-500 cursor-pointer">
              🔒
            </span>
          </div>

          <div className="flex items-center justify-between text-sm mb-5 w-full">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" /> Remember Me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            SIGN UP
          </button>

          <div className="flex items-center my-5 w-full">
            <hr className="flex-grow border-t" />
            <span className="mx-2 text-sm text-gray-500">Or sign up using</span>
            <hr className="flex-grow border-t" />
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-5 text-lg mt-2">
            <a href="#" aria-label="Instagram" className="flex items-center justify-center w-8 h-8 rounded-full">
              <FaInstagram className="text-[#E1306C] hover:scale-110 transition-transform" />
            </a>
            <a href="#" aria-label="Facebook" className="flex items-center justify-center w-8 h-8 rounded-full">
              <FaFacebookF className="text-[#1877F2] hover:scale-110 transition-transform" />
            </a>
            <a href="#" aria-label="Twitter" className="flex items-center justify-center w-8 h-8 rounded-full">
              <FaTwitter className="text-[#1DA1F2] hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Side - Image */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center relative rounded-r-lg"
          style={{
            backgroundImage: `url(${Register})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
      </div>
    </div>
  );
};

export default RegisterPage;