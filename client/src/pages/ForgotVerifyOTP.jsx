import { useState, useEffect } from 'react';
import { authApi } from '../api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResendCooldown } from '../hooks/useResendCooldown';
import { AuthShell, Dots } from '../components/AuthBits';

function ForgotVerifyOTP() {
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { cooldown, setCooldown, cooldownFromError } = useResendCooldown();

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Same guard as the signup OTP page: a refresh wipes router state.
  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please try again.');
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.post('/api/auth/verify-forgot-otp', { email, otp });
      toast.success('OTP Verified');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Previously this page had no resend at all — if the code expired the
  // user was stuck. Uses the dedicated forgot-password resend endpoint.
  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);

    try {
      const response = await authApi.post('/api/auth/resend-forgot-otp', { email });
      toast.success(response.data.message);
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

  const resendDisabled = isLoading || isResending || cooldown > 0;

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
            type="text" required maxLength="6"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            placeholder="••••••"
            className="input otp-input"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-block"
          style={{ height: 50 }}
        >
          {isLoading ? <Dots /> : 'Verify OTP'}
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

export default ForgotVerifyOTP;
