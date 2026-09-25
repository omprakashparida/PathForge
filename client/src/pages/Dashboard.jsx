import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import OnboardingForm from '../components/OnboardingForm';
import PageLoader from '../components/PageLoader';
import DashboardLayout from '../layouts/DashboardLayout';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [tip, setTip] = useState('');
  const [tipLoading, setTipLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      // The shared client attaches the token and silently refreshes it on
      // 401, so an expired access token no longer kicks the user to /login.
      const response = await api.get('/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      // A 401 that survives a refresh means the session is really dead —
      // the interceptor already redirected to /login in that case.
      if (error.response?.status !== 401) {
        console.log(error);
      }
    }
  };

  const fetchTip = async (role, phase) => {
    setTipLoading(true);

    // 1. Create a unique cache key based on the role and phase
    const CACHE_KEY = `cachedTip_${role}_${phase}`;
    const CACHE_TIME_LIMIT = 30 * 60 * 1000; // 30 minutes in milliseconds

    try {
      // 2. Check if we have a saved tip in localStorage
      const cachedDataString = localStorage.getItem(CACHE_KEY);

      if (cachedDataString) {
        const cachedData = JSON.parse(cachedDataString);
        const currentTime = new Date().getTime();

        // 3. If the saved tip is less than 30 minutes old, use it and STOP
        if (currentTime - cachedData.timestamp < CACHE_TIME_LIMIT) {
          setTip(cachedData.tip);
          setTipLoading(false);
          return;
        }
      }

      // 4. If no valid cache exists, ask the backend for a tip. The Groq
      // key stays server-side now — it used to ship in the client bundle.
      const response = await api.post('/api/tips', { role, phase });

      const fetchedTip = response.data.tip;
      // 5. Save the new tip AND the current exact time to localStorage
      setTip(fetchedTip);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        tip: fetchedTip,
        timestamp: new Date().getTime()
      }));

    } catch (error) {
      setTip('Stay consistent! Even 30 minutes of focused practice daily will compound into expertise over time.');
    } finally {
      setTipLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  useEffect(() => {
    if (dashboardData) {
      fetchTip(dashboardData.targetRole, dashboardData.currentPhase);
    }
  }, [dashboardData]);

  if (!dashboardData) return <PageLoader />;
  if (dashboardData.needsOnboarding) return <OnboardingForm onComplete={fetchDashboard} />;

  const stats = [
    { icon: '🎯', label: 'Target Role', value: dashboardData.targetRole, sub: 'Your destination' },
    { icon: '🔥', label: 'Current Streak', value: `${dashboardData.streak} days`, sub: 'Keep the fire alive' },
    { icon: '📚', label: 'Current Phase', value: dashboardData.currentPhase, sub: 'Where you are now' },
    { icon: '📌', label: 'Next Task', value: dashboardData.nextTask, sub: 'Up next on the forge' },
  ];

  return (
    <DashboardLayout name={dashboardData.name}>
      <p className="eyebrow">Dashboard</p>
      <h1 className="title">
        Welcome back, <em>{dashboardData.name}</em>
      </h1>
      <p className="subtitle">Keep building your journey — every task is a strike of the hammer.</p>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        {stats.map((s) => (
          <div key={s.label} className="card lift">
            <div className="row" style={{ marginBottom: 14 }}>
              <span className="iconbox">{s.icon}</span>
              <span className="stat-label" style={{ margin: 0 }}>{s.label}</span>
            </div>
            <div className="stat-num" style={{ fontSize: 24, lineHeight: 1.25 }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="between" style={{ marginBottom: 14 }}>
            <h3 className="serif" style={{ margin: 0, fontSize: 20 }}>Progress Overview</h3>
            <span style={{ fontWeight: 700, color: 'var(--ember2)' }}>{dashboardData.progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${dashboardData.progress}%` }} />
          </div>
          <p className="small" style={{ margin: '14px 0 0' }}>
            ✅ {dashboardData.completedTasks} / {dashboardData.totalTasks} tasks completed
          </p>
        </div>

        <div className="card">
          <h3 className="serif" style={{ margin: '0 0 14px', fontSize: 20 }}>Roadmap Status</h3>
          <div style={{ marginBottom: 16 }}>
            <span className="badge good" style={{ fontSize: 13, padding: '8px 18px' }}>
              {dashboardData.status}
            </span>
          </div>
          <p className="small" style={{ margin: '0 0 18px' }}>
            Your roadmap is live. Head over to keep striking tasks off the list.
          </p>
          <Link to="/roadmap" className="btn btn-secondary btn-sm">View Roadmap →</Link>
        </div>
      </div>

      <div className="card">
        <div className="between" style={{ marginBottom: 14 }}>
          <div className="row">
            <span className="iconbox">🤖</span>
            <h3 className="serif" style={{ margin: 0, fontSize: 20 }}>AI Daily Tip</h3>
          </div>
          <Link to="/coach" className="btn btn-ghost btn-sm">Open AI Coach →</Link>
        </div>
        {tipLoading ? (
          <div className="row">
            <span className="spin" style={{ borderTopColor: 'var(--ember)' }} />
            <p className="small" style={{ margin: 0 }}>Forging your personalized tip...</p>
          </div>
        ) : (
          <>
            <p style={{ margin: '0 0 14px', fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink)' }}>
              “{tip}”
            </p>
            <button
              onClick={() => fetchTip(dashboardData.targetRole, dashboardData.currentPhase)}
              className="btn btn-ghost btn-sm"
              style={{ paddingLeft: 0 }}
            >
              🔄 Get another tip
            </button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
