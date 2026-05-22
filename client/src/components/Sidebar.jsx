import { Link } from 'react-router-dom';

function Sidebar({ isOpen }) {

  return (

    <div
      className={`bg-white shadow-lg p-6 transition-all duration-300 overflow-hidden ${
        isOpen ? 'w-64' : 'w-0 p-0'
      }`}
    >

      {isOpen && (

        <>
          <h1 className="text-3xl font-bold text-blue-600 mb-10">
            PathForge
          </h1>

          <div className="flex flex-col gap-4">

            <Link
              to="/dashboard"
              className="p-3 rounded-xl hover:bg-gray-100"
            >
              🏠 Dashboard
            </Link>

            <Link
              to="/roadmap"
              className="p-3 rounded-xl hover:bg-gray-100"
            >
              🗺 Roadmap
            </Link>

            <Link
              to="/profile"
              className="p-3 rounded-xl hover:bg-gray-100"
            >
              👤 Profile
            </Link>

          </div>
        </>
      )}

    </div>
  );
}

export default Sidebar;