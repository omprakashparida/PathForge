import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

function Navbar({ name, toggleSidebar }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete('/api/profile/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { password },
      });
      toast.success(response.data.message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/signup');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
   
      {/* Navbar */}
    

      <div className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-gray-900 border-b border-gray-800">

        <button
          onClick={toggleSidebar}
          className="text-2xl sm:text-3xl font-bold text-gray-300 hover:text-white transition p-1"
        >
          ☰
        </button>

        <div className="relative">

          {/* Avatar */}
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer text-lg sm:text-xl font-bold hover:bg-blue-500 transition"
          >
            {name?.charAt(0).toUpperCase()}
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              {/* backdrop to close menu on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />

              <div className="absolute right-0 mt-3 w-48 sm:w-52 bg-gray-900 border border-gray-700 shadow-lg rounded-xl p-2 z-50">

                <button
                  onClick={() => { navigate('/profile'); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition text-sm sm:text-base"
                >
                  👤 Edit Profile
                </button>

                <button
                  onClick={() => { setShowDeleteModal(true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition text-sm sm:text-base"
                >
                  🗑 Delete Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition text-sm sm:text-base"
                >
                  🚪 Logout
                </button>

              </div>
            </>
          )}

        </div>
      </div>


      {/* Delete Account Modal */}
  

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

          {/* On mobile slides up from bottom, on desktop centered */}
          <div className="bg-gray-900 border border-gray-700 p-6 sm:p-8 rounded-2xl w-full sm:max-w-md">

            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-red-400">
              🗑 Delete Account
            </h2>

            <p className="mb-4 text-gray-400 text-sm sm:text-base">
              This action is <span className="text-red-400 font-semibold">permanent</span> and cannot be undone. Enter your password to confirm.
            </p>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 p-3 rounded-lg mb-4 sm:mb-6 focus:outline-none focus:border-red-500 text-sm sm:text-base"
            />

            <div className="flex gap-3 sm:gap-4">

              <button
                onClick={() => { setShowDeleteModal(false); setPassword(''); }}
                className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600 py-3 rounded-lg transition text-sm sm:text-base"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || !password}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;