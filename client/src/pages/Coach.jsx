import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import PageLoader from '../components/PageLoader';
import DashboardLayout from '../layouts/DashboardLayout';

const SUGGESTIONS = [
  { icon: '🎯', label: 'Focus today', text: 'What should I focus on today?' },
  { icon: '🧱', label: "I'm stuck", text: "I'm feeling stuck on my current phase. What should I do?" },
  { icon: '📖', label: 'Explain my phase', text: 'Explain my current phase in simple terms.' },
  { icon: '🔥', label: 'Motivate me', text: 'Motivate me to keep going.' },
];

function Coach() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [dashRes, histRes] = await Promise.all([
          api.get('/api/dashboard'),
          api.get('/api/coach/history'),
        ]);
        const d = dashRes.data;
        setName(d.name || '');
        setRole(d.targetRole || '');
        setNeedsOnboarding(!!d.needsOnboarding);

        const history = (histRes.data.messages || []).map((m) => ({
          from: m.role === 'assistant' ? 'coach' : 'user',
          text: m.content,
        }));

        setMessages(
          history.length
            ? history
            : [
                {
                  from: 'coach',
                  text: d.targetRole
                    ? `Hey ${d.name || 'there'}! I'm Forge, your AI coach. I can see your ${d.targetRole} roadmap — ask me what to focus on, get a phase explained, or just talk through where you're stuck.`
                    : `Hey ${d.name || 'there'}! I'm Forge, your AI coach. Complete your profile first so I can coach you properly.`,
                },
              ]
        );
      } catch (error) {
        if (error.response?.status !== 401) console.log(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const askCoach = async (text) => {
    const clean = text.trim();
    if (!clean || thinking) return;

    setMessages((m) => [...m, { from: 'user', text: clean }]);
    setInput('');
    setThinking(true);
    setConfirmClear(false);

    try {
      const res = await api.post('/api/coach', { message: clean });
      setMessages((m) => [...m, { from: 'coach', text: res.data.reply }]);
    } catch (error) {
      const status = error.response?.status;
      const fallback =
        status === 429
          ? 'The coach is catching its breath (AI rate limit) — try again in a moment.'
          : status === 400
            ? 'Keep messages under 1000 characters and try again.'
            : 'The forge is cooling down for a moment — try again shortly.';
      if (status !== 401) {
        setMessages((m) => [...m, { from: 'coach', text: fallback }]);
      }
    } finally {
      setThinking(false);
    }
  };

  const clearChat = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    setConfirmClear(false);
    try {
      await api.delete('/api/coach/history');
      setMessages([
        {
          from: 'coach',
          text: `Fresh page. ${role ? `I still remember your ${role} roadmap — ` : ''}what's on your mind?`,
        },
      ]);
    } catch (error) {
      if (error.response?.status !== 401) console.log(error);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <DashboardLayout name={name}>
      <p className="eyebrow">AI Coach</p>
      <h1 className="title">
        Your <em>corner coach</em>
      </h1>
      <p className="subtitle">
        A real conversation with Forge — it reads your roadmap and progress before every reply, so the coaching is about <em>your</em> journey, not generic advice.
      </p>

      {needsOnboarding ? (
        <div className="empty">
          <div className="big">🤖</div>
          <h2 className="serif" style={{ margin: '0 0 8px' }}>First, let&apos;s set up your profile</h2>
          <p className="small" style={{ margin: '0 0 20px' }}>
            The coach needs to know your goals before it can guide you.
          </p>
          <Link to="/profile" className="btn btn-primary">Complete Profile</Link>
        </div>
      ) : (
        <div className="card">
          <div className="between" style={{ marginBottom: 14 }}>
            <span className="badge ember">🧠 Remembers your roadmap</span>
            {messages.length > 1 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={clearChat}
                disabled={thinking}
                style={{ color: confirmClear ? 'var(--bad)' : undefined }}
              >
                {confirmClear ? 'Tap again to confirm' : 'Clear chat'}
              </button>
            )}
          </div>

          <div className="chat">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                <span className="who">{m.from === 'coach' ? '🤖 Forge' : 'You'}</span>
                <span style={{ whiteSpace: 'pre-line' }}>{m.text}</span>
              </div>
            ))}
            {thinking && (
              <div className="msg coach">
                <span className="who">🤖 Forge</span>
                <span className="typing"><span /><span /><span /></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <button key={s.label} className="chip" onClick={() => askCoach(s.text)} disabled={thinking}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <form
            className="chatbar"
            onSubmit={(e) => { e.preventDefault(); askCoach(input); }}
          >
            <input
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Forge anything about your journey..."
              maxLength={1000}
            />
            <button type="submit" className="btn btn-primary" disabled={thinking || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Coach;
