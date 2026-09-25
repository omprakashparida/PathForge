import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import PageLoader from '../components/PageLoader';
import DashboardLayout from '../layouts/DashboardLayout';

const SUGGESTIONS = [
  { icon: '⚡', label: 'Give me a focus tip', text: 'What should I focus on today?' },
  { icon: '🧱', label: "I'm feeling stuck", text: "I'm feeling stuck on my learning, what should I do?" },
  { icon: '🔥', label: 'Motivate me', text: 'Motivate me to keep going' },
  { icon: '🎤', label: 'Interview prep advice', text: 'Give me interview preparation advice' },
];

// Short contextual openers so the coach feels conversational. The actual
// coaching content always comes from the AI tip endpoint — nothing here
// pretends to answer open questions the backend can't handle.
function ackFor(text) {
  const t = text.toLowerCase();
  if (/stuck|confus|don't understand|hard|difficult|lost/.test(t))
    return "Getting stuck means you're at the edge of your skill — that's exactly where growth happens. Here's something concrete to try:";
  if (/motivat|tired|lazy|give up|discourag|bored/.test(t))
    return 'Dips happen to everyone. Discipline beats motivation — shrink the task until it\u2019s easy to start. In that spirit:';
  if (/interview|job|placement|resume/.test(t))
    return 'Smart — preparing early compounds fast. Here\u2019s an interview-seasoned tip:';
  if (/focus|today|now|start|plan/.test(t))
    return 'Good — clarity first. Here\u2019s where to put your energy:';
  if (/thank/.test(t))
    return 'Anytime. Keep the streak alive — and here\u2019s one more for the road:';
  if (/^(hi|hello|hey|yo)\b/.test(t))
    return 'Hey! Ready when you are. Here\u2019s your coaching:';
  return 'Noted. Here\u2019s what your coach suggests:';
}

function Coach() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phase, setPhase] = useState('');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get('/api/dashboard');
        const d = res.data;
        setName(d.name || '');
        setRole(d.targetRole || '');
        setPhase(d.currentPhase || '');
        setNeedsOnboarding(!!d.needsOnboarding);
        setMessages([
          {
            from: 'coach',
            text: d.targetRole
              ? `Hey ${d.name || 'there'}! I'm your AI coach. Ask me for a tip, or tap a suggestion below — I'll forge bite-sized coaching around your ${d.targetRole} journey.`
              : `Hey ${d.name || 'there'}! I'm your AI coach. Complete your profile first so I can coach you properly.`,
          },
        ]);
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

    // Small beat so the reply doesn't feel instant/robotic.
    await new Promise((r) => setTimeout(r, 700));

    try {
      const res = await api.post('/api/tips', { role, phase });
      const tip = res.data.tip || 'Stay consistent! Even 30 minutes of focused practice daily will compound into expertise over time.';
      setMessages((m) => [...m, { from: 'coach', text: `${ackFor(clean)}\n\n"${tip}"` }]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        { from: 'coach', text: 'The forge is cooling down for a moment — try again shortly. Meanwhile: stay consistent, even 30 minutes of focused practice compounds.' },
      ]);
    } finally {
      setThinking(false);
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
        Bite-sized AI coaching forged around your {role || 'learning'} journey. Ask for a tip anytime.
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
          <div className="chat">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                <span className="who">{m.from === 'coach' ? '🤖 AI Coach' : 'You'}</span>
                <span style={{ whiteSpace: 'pre-line' }}>{m.text}</span>
              </div>
            ))}
            {thinking && (
              <div className="msg coach">
                <span className="who">🤖 AI Coach</span>
                <span className="typing"><span /><span /><span /></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <button key={s.label} className="chip" onClick={() => askCoach(s.text)}>
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
              placeholder="Ask for coaching..."
              maxLength={200}
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
