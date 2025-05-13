import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Login from '../assets/Login.jpg';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Manual validation
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

    try {
      const response = await axios.post('https:/localhost:7189/api/auth/login', data);
      const { token } = response.data;
      login(token); // Update auth context
      toast.success('Login successful!', { position: 'top-right', autoClose: 3000 });
      navigate('/'); // Redirect to homepage
    } catch (error) {
      const errorMessage = error.response?.status === 401
        ? 'Invalid email or password'
        : 'An error occurred. Please try again.';
      setError('root', { message: errorMessage });
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6 py-8 border-1 border-gray-400">
        <div className="flex justify-center mb-6">
          <img
            src={Login}
            alt="Login Illustration"
            className="w-64 h-auto"
          />
        </div>

        <h2 className="text-3xl font-semibold text-black mb-2">Login</h2>
        <p className="text-gray-600 mb-6">Welcome Back !!!</p>

        {errors.root && (
          <div className="text-red-500 text-sm mb-4">{errors.root.message}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="flex items-center bg-gray-100 p-3 rounded">
              <FaUser className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Email"
                className={`bg-transparent outline-none flex-1 text-gray-700 ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <div className="flex items-center bg-gray-100 p-3 rounded">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                placeholder="Password"
                className={`bg-transparent outline-none flex-1 text-gray-700 ${errors.password ? 'border-red-500' : ''}`}
                {...register('password')}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1f6ba2] text-white py-2 rounded mt-4 hover:bg-[#195684] transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-700">
          Don’t have an account ?{' '}
          <Link to="/Register" className="text-blue-600 hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}