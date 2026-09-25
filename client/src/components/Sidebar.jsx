import { Link, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';

export const NAV_LINKS = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/roadmap', icon: '🗺', label: 'Roadmap' },
  { to: '/coach', icon: '🤖', label: 'AI Coach' },
  { to: '/resources', icon: '📚', label: 'Resources' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

function Sidebar({ name }) {
  const location = useLocation();

  return (
    <aside className="rail">
      <Link to="/dashboard" className="rail-brand">
        <span className="mark">P</span>
        <span className="word">Path<em>Forge</em></span>
      </Link>

      <div className="rail-sec">Menu</div>
      <nav className="rail-nav">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`rail-link${isActive ? ' on' : ''}`}
            >
              <span className="ic">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="rail-foot">
        <UserMenu name={name} />
      </div>
    </aside>
  );
}

export default Sidebar;
