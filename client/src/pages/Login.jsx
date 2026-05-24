import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        '/api/auth/login',
        formData
      );

      localStorage.setItem(
        'accessToken',
        response.data.accessToken
      );

      localStorage.setItem(
        'refreshToken',
        response.data.refreshToken
      );

      const token = response.data.accessToken;

      try {

        const profileResponse = await axios.get(
         '/api/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.data.profile) {
          navigate('/dashboard');
        }

      } catch (error) {

        if (error.response.status === 404) {
          navigate('/profile');
        } else {
          alert('Something went wrong');
        }
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Something went wrong"
        );
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
    
    {/* ========================== */}
    {/* Background Glow Effects */}
    {/* ========================== */}
    
    <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
    
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
    
    
    <div className="grid md:grid-cols-2 min-h-screen">
    
    {/* ========================== */}
    {/* Left Side Content */}
    {/* ========================== */}
    
    <div className="flex flex-col justify-center px-16 text-white">
    
    <p className="text-blue-400 font-semibold mb-5">
    
    🚀 Welcome Back
    
    </p>
    
    <h1 className="text-6xl font-bold leading-tight mb-8">
    
    Continue Your
    
    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
    
    {" "}Learning Journey
    
    </span>
    
    </h1>
    
    <p className="text-gray-400 text-lg mb-10">
    
    Track progress, maintain streaks,
    and continue building your career.
    
    </p>
    
    
    {/* ========================== */}
    {/* Features Cards */}
    {/* ========================== */}
    
    <div className="space-y-5">
    
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4">
    
    🎯 Personalized Roadmaps
    
    </div>
    
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4">
    
    🔥 Daily Streak Tracking
    
    </div>
    
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4">
    
    📈 Progress Analytics
    
    </div>
    
    </div>
    
    </div>
    
    
    {/* ========================== */}
    {/* Login Form */}
    {/* ========================== */}
    
    <div className="flex justify-center items-center px-10">
    
    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl w-full max-w-md p-10">
    
    <h2 className="text-white text-3xl font-bold mb-8">
    
    Login
    
    </h2>
    
    
    {/* ========================== */}
    {/* Form Starts */}
    {/* ========================== */}
    
    <form
    onSubmit={handleLogin}
    className="space-y-5"
    >
    
    <input
    name="email"
    value={formData.email}
    placeholder="Email"
    onChange={handleChange}
    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
    />
    
    <input
    type="password"
    name="password"
    value={formData.password}
    placeholder="Password"
    onChange={handleChange}
    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
    />
    
    
    {/* ========================== */}
    {/* Login Button */}
    {/* ========================== */}
    
    <button
    type="submit"
    className="w-full py-4 rounded-xl bg-blue-600 hover:scale-105 transition duration-300 text-white font-semibold"
    >
    
    Login
    
    </button>
    
    
    {/* ========================== */}
    {/* Signup Link */}
    {/* ========================== */}
    
    <p className="text-center text-gray-400">
    
    Don't have an account?{" "}
    
    <Link
    to="/signup"
    className="text-blue-400 hover:text-blue-300"
    >
    
    Sign Up
    
    </Link>
    
    </p>
    
    </form>
    
    {/* ========================== */}
    {/* Form Ends */}
    {/* ========================== */}
    
    </div>
    
    </div>
    
    </div>
    
    </div>
    
    );
    }
    
    export default Login;