import { useState, useEffect } from 'react';
import { authApi } from '../api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResendCooldown } from '../hooks/useResendCooldown';
import { AuthShell, Dots } from '../components/AuthBits';

function VerifyOTP() {
  const [otp, setOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { cooldown, setCooldown, cooldownFromError } = useResendCooldown();

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Refreshing this page wipes router state — without an email there's
  // nothing to verify, so send the user back instead of firing a
  // broken request with `email: undefined`.
  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please sign up again.');
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setIsVerifying(true);

    try {
      const response = await authApi.post('/api/auth/verify-signup-otp', { email, otp });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);

    try {
      const response = await authApi.post('/api/auth/resend-otp', { email });
      toast.success(response.data.message);
      // Backend cooldown is 30s x resend count; start the UI at 30s
      // minimum so the next tap can't fire instantly.
      setCooldown(30);
    } catch (error) {
      if (!cooldownFromError(error)) {
        toast.error(error.response?.data?.message || 'Failed to resend');
      }
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  const resendDisabled = isVerifying || isResending || cooldown > 0;

  return (
    <AuthShell>
      <h1 style={{ textAlign: 'center' }}>Verify OTP</h1>
      <p className="sub" style={{ textAlign: 'center' }}>
        Enter the 6-digit code sent to
        <br />
        <span className="auth-link" style={{ wordBreak: 'break-all' }}>{email}</span>
      </p>

      <form onSubmit={handleVerify}>
        <div className="field">
          <input
            type="text"
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            maxLength="6"
            className="input otp-input"
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying || isResending}
          className="btn btn-primary btn-block"
          style={{ height: 50 }}
        >
          {isVerifying ? <Dots /> : 'Verify OTP'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={resendDisabled}
        className="btn btn-secondary btn-block"
        style={{ height: 50, marginTop: 12 }}
      >
        {isResending ? <Dots /> : cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
      </button>

      <p className="dim" style={{ fontSize: 12.5, textAlign: 'center', marginTop: 14 }}>
        Didn&apos;t receive the code? Check your Spam/Junk folder.
      </p>
    </AuthShell>
  );
}

export default VerifyOTP;
