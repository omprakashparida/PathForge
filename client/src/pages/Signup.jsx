import { useState } from 'react';
import { authApi } from '../api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Dots } from '../components/AuthBits';

const PERKS = [
  { icon: '🎯', text: 'Personalized Roadmaps' },
  { icon: '🔥', text: 'Daily Streak Tracking' },
  { icon: '📈', text: 'Progress Analytics' },
];

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // The confirm-password field existed but was never checked — a typo
    // here would lock the user out of their own new account.
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.post('/api/auth/send-signup-otp', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.data.message);
      navigate('/verify-otp', { state: { email: formData.email } });
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
        <p className="eyebrow">Join PathForge</p>
        <h1 className="title" style={{ fontSize: 'clamp(36px,5vw,58px)' }}>
          Build your <em>learning journey</em>
        </h1>
        <p className="subtitle">
          Create your account and get personalized roadmaps tailored to your goals.
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
          <h1 style={{ textAlign: 'center' }}>Create Account</h1>
          <p className="sub" style={{ textAlign: 'center' }}>
            Start forging your path in under a minute.
          </p>

          <form onSubmit={handleSignup}>
            <div className="field">
              <label className="field-label">Full Name</label>
              <input
                name="name" required value={formData.name} onChange={handleChange}
                placeholder="Ada Lovelace" className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Email</label>
              <input
                name="email" type="email" required value={formData.email} onChange={handleChange}
                placeholder="you@example.com" className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input
                name="password" type="password" required value={formData.password} onChange={handleChange}
                placeholder="••••••••" className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Confirm Password</label>
              <input
                name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                placeholder="••••••••" className="input"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary btn-block" style={{ height: 50, marginTop: 6 }}>
              {isLoading ? <Dots /> : 'Create Account'}
            </button>

            <p className="small" style={{ textAlign: 'center', marginTop: 18 }}>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
