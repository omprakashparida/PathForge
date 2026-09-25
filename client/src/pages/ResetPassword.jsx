import { useState, useEffect } from 'react';
import { authApi } from '../api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthShell, Dots } from '../components/AuthBits';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please try again.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.post('/api/auth/reset-password', { email, newPassword });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 style={{ textAlign: 'center' }}>Reset Password</h1>
      <p className="sub" style={{ textAlign: 'center' }}>
        Create a strong new password for your account.
      </p>

      <form onSubmit={handleReset}>
        <div className="field">
          <label className="field-label">New Password</label>
          <input
            type="password" required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="input"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-block"
          style={{ height: 50, marginTop: 6 }}
        >
          {isLoading ? <Dots /> : 'Update Password'}
        </button>
      </form>
    </AuthShell>
  );
}

export default ResetPassword;
