import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api, { authApi } from '../api';
import toast from 'react-hot-toast';
import { Dots } from '../components/AuthBits';

const PERKS = [
  { icon: '🎯', text: 'Personalized Roadmaps' },
  { icon: '🤖', text: 'AI Coach Guidance' },
  { icon: '🔥', text: 'Daily Streak Tracking' },
];

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.post('/api/auth/login', formData);

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      try {
        const profileResponse = await api.get('/api/profile');
        if (profileResponse.data.profile) {
          navigate('/dashboard');
        } else {
          navigate('/profile');
        }
      } catch (error) {
        if (error.response?.status === 404) {
          navigate('/profile');
        } else {
          toast.error('Something went wrong');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="split">
      <div className="split-left">
        <div className="glow-a" />
        <p className="eyebrow">Welcome back</p>
        <h1 className="title" style={{ fontSize: 'clamp(36px,5vw,58px)' }}>
          Continue your <em>learning journey</em>
        </h1>
        <p className="subtitle">
          Track progress, maintain streaks, and keep forging toward your dream career.
        </p>
        <div className="hero-list">
          {PERKS.map((p) => (
            <div key={p.text} className="hero-item">
              <span className="iconbox" style={{ width: 34, height: 34, fontSize: 16 }}>{p.icon}</span>
              {p.text}
            </div>
          ))}
        </div>
      </div>

      <div className="split-right" style={{ position: 'relative' }}>
        <div className="glow-b" />
        <div className="auth-card" style={{ margin: 0 }}>
          <Link to="/" className="brand-row" style={{ textDecoration: 'none', marginBottom: 6 }}>
            <span className="mark">P</span>
            <span className="word">Path<em>Forge</em></span>
          </Link>
          <h1 style={{ textAlign: 'center' }}>Login</h1>
          <p className="sub" style={{ textAlign: 'center' }}>
            Pick up right where you left off.
          </p>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="field-label">Email</label>
              <input
                name="email" type="email" required
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com" className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input
                name="password" type="password" required
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" className="input"
              />
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Link to="/forgot-password" className="auth-link" style={{ fontSize: 13 }}>
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary btn-block" style={{ height: 50, marginTop: 6 }}>
              {isLoading ? <Dots /> : 'Login'}
            </button>

            <p className="small" style={{ textAlign: 'center', marginTop: 18 }}>
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="auth-link">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
