import { Link, useLocation } from 'react-router-dom';
import Sidebar, { NAV_LINKS } from '../components/Sidebar';
import UserMenu from '../components/UserMenu';

// App shell: fixed rail on desktop, slim top bar + bottom nav on mobile.
function DashboardLayout({ children, name }) {
  const location = useLocation();

  return (
    <div className="shell">
      <Sidebar name={name} />

      <div className="main">
        <div className="mobile-topbar">
          <Link to="/dashboard" className="brand-row" style={{ textDecoration: 'none' }}>
            <span className="mark" style={{ width: 30, height: 30, fontSize: 16 }}>P</span>
            <span className="word" style={{ fontSize: 18 }}>Path<em>Forge</em></span>
          </Link>
          <div style={{ position: 'relative' }}>
            <UserMenu name={name} dropUp={false} compact />
          </div>
        </div>

        <main style={{ flex: 1 }}>
          <div className="page">{children}</div>
        </main>

        <nav className="mnav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'on' : ''}
            >
              <span className="ic">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default DashboardLayout;
