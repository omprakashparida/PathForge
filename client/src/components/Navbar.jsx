import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Navbar({
  name,
  toggleSidebar,
}) {

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
        'http://localhost:5000/api/profile/delete',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          data: {
            password,
          },
        }
      );

      alert(response.data.message);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      navigate('/signup');

    } catch (error) {

      console.log(error);

      alert(error.response.data.message);
    }
  };


  return (
    <>

      <div className="flex justify-between items-center px-8 py-4 shadow bg-white">

        <button
          onClick={toggleSidebar}
          className="text-3xl font-bold"
        >
          ☰
        </button>

        <div className="relative">

          <div
            onClick={() => setShowMenu(!showMenu)}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer text-xl font-bold"
          >
            {name?.charAt(0).toUpperCase()}
          </div>

          {showMenu && (

            <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-xl p-2 z-50">

              <button
                onClick={() => navigate('/profile')}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg"
              >
                👤 Edit Profile
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg text-red-500"
              >
                🗑 Delete Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg"
              >
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </div>

      {showDeleteModal && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl w-full max-w-md">

            <h2 className="text-2xl font-bold mb-4 text-red-500">
              Delete Account
            </h2>

            <p className="mb-4 text-gray-600">
              Enter your password to confirm account deletion.
            </p>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg mb-6"
            />

            <div className="flex gap-4">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg"
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