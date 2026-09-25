import { Link } from 'react-router-dom';

// Shared bits for the auth screens so the six pages stay DRY.
export function Dots() {
  return (
    <span className="dots">
      <span /><span /><span />
    </span>
  );
}

export function AuthShell({ children, wide = false }) {
  return (
    <div className="auth-wrap">
      <div className="glow-a" />
      <div className="glow-b" />
      <div className="auth-card" style={wide ? { maxWidth: 480 } : undefined}>
        <Link to="/" className="brand-row" style={{ textDecoration: 'none', marginBottom: 6 }}>
          <span className="mark">P</span>
          <span className="word">Path<em>Forge</em></span>
        </Link>
        {children}
      </div>
    </div>
  );
}
