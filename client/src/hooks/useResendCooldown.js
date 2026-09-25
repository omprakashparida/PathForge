import { useEffect, useState } from 'react';

// Mirrors the backend's resend cooldown in the UI. The backend enforces a
// dynamic cooldown (30s x resend count) and a 30-minute lock after 5 resends,
// so the button shows a countdown instead of letting the user hammer it and
// eat "Wait Ns" errors.
export function useResendCooldown() {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown > 0]);

  // Backend answers 400 "Wait Ns" when its cooldown hasn't elapsed yet —
  // turn that into the same countdown instead of a dead click.
  const cooldownFromError = (error) => {
    const match = /Wait (\d+)s/.exec(error.response?.data?.message || '');
    if (match) {
      setCooldown(parseInt(match[1], 10));
      return true;
    }
    return false;
  };

  return { cooldown, setCooldown, cooldownFromError };
}
