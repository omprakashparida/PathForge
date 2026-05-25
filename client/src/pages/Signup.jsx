import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";
function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        '/api/auth/signup',
        formData
      );

      toast.success(response.data.message);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {

      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
    
    
    {/* ========================== */}
    {/* Background Glow */}
    {/* ========================== */}
    
    <div className="absolute top-10 left-5 md:top-20 md:left-20 w-60 md:w-96 h-60 md:h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
    
    <div className="absolute bottom-10 right-5 md:bottom-20 md:right-20 w-60 md:w-96 h-60 md:h-96 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
    
    
    <div className="grid lg:grid-cols-2 min-h-screen">
    
    
    {/* ========================== */}
    {/* LEFT CONTENT */}
    {/* ========================== */}
    
    <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 text-white text-center lg:text-left">
    
    <p className="text-blue-400 font-semibold mb-5">
    
    🚀 Join PathForge
    
    </p>
    
    
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8">
    
    Build Your
    
    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
    
    {" "}Learning Journey
    
    </span>
    
    </h1>
    
    
    <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto lg:mx-0">
    
    Create your account and get personalized
    roadmaps tailored to your goals.
    
    </p>
    
    
    <div className="space-y-5 max-w-lg mx-auto lg:mx-0">
    
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
    {/* SIGNUP FORM */}
    {/* ========================== */}
    
    <div className="flex justify-center items-center px-4 sm:px-6 lg:px-10 py-10">
    
    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl w-full max-w-md p-6 sm:p-10">
    
    <h2 className="text-white text-3xl font-bold mb-8 text-center">
    
    Create Account
    
    </h2>
    
    
    <form
    onSubmit={handleSignup}
    className="space-y-5"
    >
    
    <input
    name="name"
    placeholder="Full Name"
    onChange={handleChange}
    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
    />
    
    
    <input
    name="email"
    placeholder="Email"
    onChange={handleChange}
    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
    />
    
    
    <input
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
    />
    
    
    <input
    type="password"
    name="confirmPassword"
    placeholder="Confirm Password"
    onChange={handleChange}
    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
    />
    
    
    {/* ========================== */}
    {/* Signup Button */}
    {/* ========================== */}
    
    <button
    type="submit"
    disabled={isLoading}
    className={`w-full h-14 rounded-xl flex justify-center items-center font-semibold transition-all duration-300
    
    ${isLoading
    ? "bg-blue-800 cursor-not-allowed opacity-80"
    : "bg-blue-600 hover:scale-105 text-white"
    }`}
    >
    
    {isLoading ? (
    
    <div className="flex gap-1.5 items-center">
    
    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>
    
    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:150ms]"></div>
    
    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:300ms]"></div>
    
    </div>
    
    ):(
    
    "Create Account"
    
    )}
    
    </button>
    
    
    <p className="text-center text-gray-400">
    
    Already have an account?{" "}
    
    <Link
    to="/login"
    className="text-blue-400 hover:text-blue-300"
    >
    
    Login
    
    </Link>
    
    </p>
    
    </form>
    
    </div>
    
    </div>
    
    </div>
    
    </div>
    
    );
}

export default Signup;