import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen }) {
  const location = useLocation();

  const links = [
    { to: '/dashboard', emoji: '🏠', label: 'Dashboard' },
    { to: '/roadmap', emoji: '🗺', label: 'Roadmap' },
    { to: '/profile', emoji: '👤', label: 'Profile' },
  ];

  return (
    <div
      className={`bg-gray-900 transition-all duration-300 overflow-hidden flex flex-col
        ${isOpen ? 'w-64 border-r border-gray-800' : 'w-16 border-r border-gray-800'}
      `}
      style={{ minHeight: '100vh' }}
    >

      {/* ========================== */}
      {/* Logo — always visible */}
      {/* ========================== */}

      <div className="flex items-center gap-3 px-4 py-6 overflow-hidden">

        {/* Icon always shown */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
          <span className="text-white font-black text-sm">PF</span>
        </div>

        {/* Text only when open */}
        <span
          className={`text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap transition-all duration-300
            ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
          `}
        >
          PathForge
        </span>

      </div>

      {/* ========================== */}
      {/* Divider */}
      {/* ========================== */}

      <div className="mx-3 border-t border-gray-800 mb-4"></div>

      {/* ========================== */}
      {/* Nav Links */}
      {/* ========================== */}

      <div className="flex flex-col gap-1 px-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <span className="text-xl flex-shrink-0">{link.emoji}</span>

              <span
                className={`text-sm font-medium whitespace-nowrap transition-all duration-300
                  ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                `}
              >
                {link.label}
              </span>

            </Link>
          );
        })}
      </div>

    </div>
  );
}

export default Sidebar;