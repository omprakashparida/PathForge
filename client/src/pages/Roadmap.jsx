import { useEffect, useState } from 'react';
import api from '../api';
import PageLoader from '../components/PageLoader';
import DashboardLayout from '../layouts/DashboardLayout';
import toast from 'react-hot-toast';
import { Dots } from '../components/AuthBits';

function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // Groq doesn't always return clean URLs in task.resources — sometimes
  // it's plain text ("MDN Web Docs"), markdown, or a URL buried in a
  // sentence. Pull out the first real http(s) URL; return null if none.
  const extractUrl = (raw) => {
    if (!raw || typeof raw !== 'string') return null;
    const m = raw.match(/https?:\/\/[^\s)>\]]+/);
    if (!m) return null;
    try {
      const u = new URL(m[0].replace(/[.,;:'"]+$/, ''));
      if (!/^https?:$/.test(u.protocol)) return null;
      return u;
    } catch {
      return null;
    }
  };

  // Working links for a task: validated Groq URLs first; bare titles (no URL)
  // become search pills so the user's resource names stay visible and every
  // pill actually does something when tapped.
  const taskLinks = (task) => {
    const links = [];
    for (const raw of task.resources || []) {
      const u = extractUrl(raw);
      if (u) {
        links.push({ href: u.href, label: u.hostname.replace(/^www\./, ''), icon: '🔗' });
        continue;
      }
      if (typeof raw === 'string' && raw.trim()) {
        const title = raw
          .trim()
          .replace(/^[*_~`#"'“”‘’\s]+|[*_~`#"'“”‘’\s]+$/g, '')
          .slice(0, 60);
        if (title) {
          links.push({
            href: `https://www.google.com/search?q=${encodeURIComponent(title)}`,
            label: title,
            icon: '🔍',
          });
        }
      }
    }
    if (links.length === 0 && task.task) {
      links.push({
        href: `https://www.google.com/search?q=${encodeURIComponent(task.task + ' tutorial')}`,
        label: 'Search the web',
        icon: '🔍',
      });
    }
    return links;
  };

  // 401s from an expired access token are silently refreshed by the
  // shared client. If we still see one here, the session is really dead
  // and the interceptor has already sent the user to /login.
  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
      return true;
    }
    return false;
  };

  const fetchRoadmap = async () => {
    try {
      const response = await api.get('/api/roadmap');
      setRoadmap(response.data.roadmap);
      setUserName(response.data.name);
      setFetchError(false);
    } catch (error) {
      if (handleAuthError(error)) return;

      if (error.response?.status === 404) {
        // Expected state for a new user — no roadmap yet, not an error.
        setRoadmap(null);
        setFetchError(false);
      } else {
        // Anything else (network issue, 500, etc.) is a real failure —
        // don't let it look identical to "no roadmap yet."
        console.log(error);
        setFetchError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    try {
      setIsGenerating(true);
      const response = await api.post('/api/roadmap/generate', {});
      toast.success(response.data.message);
      fetchRoadmap();
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Failed generating roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerates after the 14-day lock expires. The backend now REPLACES the
  // old document (it used to stack duplicates, which is why the old roadmap
  // kept showing). A 400 here means the lock is still active.
  const handleRegenerate = async () => {
    if (!window.confirm('Replace your current roadmap with a freshly generated one? Your progress will reset.')) return;
    try {
      setIsGenerating(true);
      const response = await api.post('/api/roadmap/generate', {});
      toast.success(response.data.message);
      fetchRoadmap();
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Failed to regenerate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const markTaskComplete = async (phase, taskId, task) => {
    try {
      await api.put('/api/roadmap/complete-task', { phase, taskId, task });
      fetchRoadmap();
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error(error.response?.data?.message || 'Failed to mark task complete');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  // Real fetch failure (not "no roadmap yet") — don't push the user toward
  // regenerating when they might already have a roadmap sitting on the server.
  if (fetchError) {
    return (
      <DashboardLayout>
        <div className="empty" style={{ marginTop: 40 }}>
          <div className="big">⚠️</div>
          <h2 className="serif" style={{ margin: '0 0 8px' }}>Couldn&apos;t load your roadmap</h2>
          <p className="small" style={{ margin: '0 0 20px' }}>
            Something went wrong fetching your roadmap. Please try again.
          </p>
          <button
            onClick={() => { setLoading(true); fetchRoadmap(); }}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!roadmap) {
    return (
      <DashboardLayout>
        <div className="empty" style={{ marginTop: 40 }}>
          <div className="big">🗺️</div>
          <h2 className="serif" style={{ margin: '0 0 8px', fontSize: 28 }}>Generate your AI Roadmap</h2>
          <p className="small" style={{ margin: '0 0 22px' }}>
            Create a personalized roadmap forged around your profile.
          </p>
          <button
            onClick={handleGenerateRoadmap}
            disabled={isGenerating}
            className="btn btn-primary"
            style={{ padding: '14px 36px' }}
          >
            {isGenerating ? <Dots /> : 'Generate Roadmap'}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const totalTasks = roadmap.phases?.reduce((n, p) => n + (p.tasks?.length || 0), 0) || 0;
  const doneTasks = roadmap.phases?.reduce(
    (n, p) => n + (p.tasks?.filter((t) => t.completed)?.length || 0), 0
  ) || 0;

  return (
    <DashboardLayout name={userName}>
      <p className="eyebrow">Roadmap</p>
      <div className="between" style={{ alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap' }}>
        <h1 className="title" style={{ margin: 0 }}>{roadmap.title}</h1>
        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="btn btn-secondary btn-sm"
          style={{ marginTop: 8 }}
        >
          {isGenerating ? <Dots /> : '🔄 Regenerate'}
        </button>
      </div>
      <p className="subtitle">Track your journey and complete milestones — one strike at a time.</p>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="between" style={{ marginBottom: 12 }}>
          <h3 className="serif" style={{ margin: 0, fontSize: 19 }}>Overall Progress</h3>
          <span style={{ fontWeight: 700, color: 'var(--ember2)' }}>{roadmap.progress || 0}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${roadmap.progress || 0}%` }} />
        </div>
        <div className="between" style={{ marginTop: 12 }}>
          <span className="small">✅ {doneTasks} / {totalTasks} tasks completed</span>
          <span className="small dim">{roadmap.phases?.length || 0} phases</span>
        </div>
      </div>

      {roadmap.phases.map((phase, index) => {
        const phaseDone = phase.tasks?.filter((t) => t.completed)?.length || 0;
        const phaseTotal = phase.tasks?.length || 0;
        return (
          <div key={index} className="card phase">
            <div className="phase-head">
              <span className="phase-dot">{phase.phase}</span>
              <h2 className="phase-name">{phase.title}</h2>
              <span className="badge phase-count">{phaseDone}/{phaseTotal}</span>
            </div>
            {phase.tasks.map((task, taskIndex) => (
              <div
                key={taskIndex}
                className={`task${task.completed ? ' done' : ''}`}
                onClick={() => { if (!task.completed) markTaskComplete(phase.phase, task._id, task.task); }}
              >
                <span className="check">✓</span>
                <span className="task-body">
                  <span className="task-title">{task.task}</span>
                  <span className="task-res">
                    {taskLinks(task).map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="res-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.icon} <span className="res-label">{link.label}</span>
                      </a>
                    ))}
                  </span>
                </span>
                {!task.completed && <span className="task-meta">Tap to complete →</span>}
              </div>
            ))}
          </div>
        );
      })}
    </DashboardLayout>
  );
}

export default Roadmap;
