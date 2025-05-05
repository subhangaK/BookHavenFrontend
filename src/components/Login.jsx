import React from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import Login from "../assets/Login.jpg";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6 py-8 border-1 border-gray-400">
        <div className="flex justify-center mb-6">
          <img
            src={Login} // Replace with your actual image path
            alt="Login Illustration"
            className="w-64 h-auto"
          />
        </div>

        <h2 className="text-3xl font-semibold text-black mb-2">Login</h2>
        <p className="text-gray-600 mb-6">Welcome Back !!!</p>

        <div className="mb-4">
          <div className="flex items-center bg-gray-100 p-3 rounded">
            <FaUser className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Username or email"
              className="bg-transparent outline-none flex-1 text-gray-700"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center bg-gray-100 p-3 rounded">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none flex-1 text-gray-700"
            />
          </div>
          <div className="text-right mt-2">
            <a href="#" className="text-sm text-gray-600 hover:underline">
              Forgot Password ?
            </a>
          </div>
        </div>

        <button className="w-full bg-[#1f6ba2] text-white py-2 rounded mt-4 hover:bg-[#195684] transition">
          Login
        </button>

        <p className="text-center mt-6 text-sm text-gray-700">
          Don’t have an account ?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
}
