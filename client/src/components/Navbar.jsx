import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
function Navbar({ name, toggleSidebar }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(
        '/api/profile/delete',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { password },
        }
      );
      toast.success(
        response.data.message
      );
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/signup');
    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );
      console.log(error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4 bg-gray-900 border-b border-gray-800">

        <button onClick={toggleSidebar} className="text-3xl font-bold text-gray-300 hover:text-white transition">
          ☰
        </button>

        <div className="relative">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer text-xl font-bold hover:bg-blue-500 transition"
          >
            {name?.charAt(0).toUpperCase()}
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-52 bg-gray-900 border border-gray-700 shadow-lg rounded-xl p-2 z-50">
              <button
                onClick={() => navigate('/profile')}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
              >
                👤 Edit Profile
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition"
              >
                🗑 Delete Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-full max-w-md">

            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Delete Account
            </h2>

            <p className="mb-4 text-gray-400">
              Enter your password to confirm account deletion.
            </p>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 p-3 rounded-lg mb-6 focus:outline-none focus:border-blue-500"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600 py-3 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;