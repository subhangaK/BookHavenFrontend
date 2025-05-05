import React from 'react';
import { useForm } from 'react-hook-form';
import { FaInstagram, FaFacebookF, FaTwitter, FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Register from '../assets/Register.jpg';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Manual validation
    if (!data.username) {
      setError('username', { message: 'Username is required' });
      toast.error('Username is required', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (data.username.length < 3) {
      setError('username', { message: 'Username must be at least 3 characters' });
      toast.error('Username must be at least 3 characters', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!data.email) {
      setError('email', { message: 'Email is required' });
      toast.error('Email is required', { position: 'top-right', autoClose: 3000 });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError('email', { message: 'Invalid email address' });
      toast.error('Invalid email address', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!data.password) {
      setError('password', { message: 'Password is required' });
      toast.error('Password is required', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (data.password.length < 6) {
      setError('password', { message: 'Password must be at least 6 characters' });
      toast.error('Password must be at least 6 characters', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!data.confirmPassword) {
      setError('confirmPassword', { message: 'Confirm password is required' });
      toast.error('Confirm password is required', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      toast.error('Passwords do not match', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      console.log('Sending request with payload:', payload);
      const response = await axios.post('http://127.0.0.1:7189/api/auth/register', payload);
      console.log('Response:', response.data);
      toast.success('Registration successful! Please log in.', { position: 'top-right', autoClose: 3000 });
      navigate('/Login');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors[0].description
        : 'An error occurred. Please try again.';
      setError('root', { message: errorMessage });
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    }
  };

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

          {errors.root && (
            <div className="text-red-500 text-sm mb-4">{errors.root.message}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mb-4 w-full">
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full p-2 pl-10 border rounded text-sm ${errors.username ? 'border-red-500' : ''}`}
                  {...register('username')}
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={`w-full p-2 pl-10 border rounded text-sm ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-4 relative w-full">
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full p-2 pl-10 border rounded text-sm ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="mb-4 relative w-full">
              <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className={`w-full p-2 pl-10 border rounded text-sm ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm mb-5 w-full">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" {...register('rememberMe')} /> Remember Me
              </label>
              <Link to="#" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              SIGN UP
            </button>
          </form>

          <div className="flex items-center my-5 w-full">
            <hr className="flex-grow border-t" />
            <span className="mx-2 text-sm text-gray-500">Or sign up using</span>
            <hr className="flex-grow border-t" />
          </div>

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
}