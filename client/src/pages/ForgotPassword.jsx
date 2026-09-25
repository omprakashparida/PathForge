import { useState } from 'react';
import { authApi } from '../api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { AuthShell, Dots } from '../components/AuthBits';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.post('/api/auth/forgot-password', { email });
      toast.success(response.data.message);
      navigate('/forgot-verify-otp', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 style={{ textAlign: 'center' }}>Forgot Password</h1>
      <p className="sub" style={{ textAlign: 'center' }}>
        Enter your email address to receive a 6-digit OTP.
      </p>

      <form onSubmit={handleSendOTP}>
        <div className="field">
          <label className="field-label">Email</label>
          <input
            type="email" required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-block"
          style={{ height: 50, marginTop: 6 }}
        >
          {isLoading ? <Dots /> : 'Send OTP'}
        </button>

        <p className="small" style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/login" className="auth-link">← Wait, I remember my password</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default ForgotPassword;
