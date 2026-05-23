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

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        formData
      );

      toast.success(response.data.message);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
        );
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">

      {/* Glow */}

      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>


      <div className="grid md:grid-cols-2 min-h-screen">

        {/* LEFT */}

        <div className="flex flex-col justify-center px-16 text-white">

          <p className="text-blue-400 font-semibold mb-5">

            🚀 Join PathForge

          </p>

          <h1 className="text-6xl font-bold leading-tight mb-8">

            Build Your

            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">

              {" "}Learning Journey

            </span>

          </h1>

          <p className="text-gray-400 text-lg mb-10">

            Create your account and get personalized
            roadmaps tailored to your goals.

          </p>


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


        {/* RIGHT */}

        <div className="flex justify-center items-center px-10">

          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl w-full max-w-md p-10">

            <h2 className="text-white text-3xl font-bold mb-8">

              Create Account

            </h2>


            <div className="space-y-5">
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


                <button
                  className="w-full py-4 rounded-xl bg-blue-600 hover:scale-105 transition text-white font-semibold"
                >

                  Create Account

                </button>


                <p className="text-center text-gray-400">

                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="text-blue-400"
                  >

                    Login

                  </Link>

                </p>

              </form>
            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Signup;