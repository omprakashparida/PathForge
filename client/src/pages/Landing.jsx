import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🎯', title: 'Personalized Roadmaps', text: 'AI-generated learning paths shaped around your goals, skills and schedule.' },
  { icon: '🤖', title: 'AI Coach', text: 'Bite-sized coaching and daily tips that keep you moving forward.' },
  { icon: '🔥', title: 'Daily Streaks', text: 'Stay consistent and build learning habits that compound.' },
  { icon: '📚', title: 'Curated Resources', text: 'Hand-picked courses, docs and videos matched to your journey.' },
];

function Landing() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="glow-a" />
      <div className="glow-b" />

      {/* Nav */}
      <nav className="landing-nav">
        <Link to="/" className="brand-row" style={{ textDecoration: 'none' }}>
          <span className="mark">P</span>
          <span className="word">Path<em>Forge</em></span>
        </Link>
        <div className="row">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/signup" className="btn btn-primary btn-sm" style={{ padding: '10px 22px' }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="split" style={{ minHeight: '100vh' }}>
        <div className="split-left">
          <p className="eyebrow">Personalized learning platform</p>
          <h1 className="title" style={{ fontSize: 'clamp(38px,5.5vw,64px)' }}>
            Forge your <em>learning journey</em>
          </h1>
          <p className="subtitle" style={{ fontSize: 17 }}>
            AI-powered roadmaps tailored to your goals. Track progress,
            maintain streaks, and forge your way to your dream career.
          </p>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
              Start Learning
            </Link>
            <a href="#features" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: 15 }}>
              Explore Features
            </a>
          </div>

          <div className="hero-list">
            {[
              { icon: '🎯', text: 'Personalized Roadmaps' },
              { icon: '🤖', text: 'AI Coach Guidance' },
              { icon: '🔥', text: 'Daily Streak Tracking' },
            ].map((f) => (
              <div key={f.text} className="hero-item">
                <span className="iconbox" style={{ width: 34, height: 34, fontSize: 16 }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="split-right">
          <div className="card" style={{ width: '100%', maxWidth: 420 }}>
            <div className="between" style={{ marginBottom: 18 }}>
              <h3 className="serif" style={{ margin: 0, fontSize: 21 }}>Dashboard Preview</h3>
              <span className="badge ember">Live</span>
            </div>
            <div className="grid" style={{ gap: 12 }}>
              <div className="row">
                <span className="iconbox">🎯</span>
                <div>
                  <div className="small">Target role</div>
                  <div style={{ fontWeight: 600 }}>Full Stack Developer</div>
                </div>
              </div>
              <div className="row">
                <span className="iconbox">🔥</span>
                <div>
                  <div className="small">Current streak</div>
                  <div style={{ fontWeight: 600 }}>5 days</div>
                </div>
              </div>
              <div>
                <div className="between" style={{ marginBottom: 8 }}>
                  <span className="small">Progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--ember2)' }}>45%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '45%' }} />
                </div>
              </div>
              <div className="notice info" style={{ margin: 0 }}>
                <span>🤖</span>
                <span>“Ship one small project this week — applied practice beats another tutorial.”</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px clamp(18px,4vw,44px)', maxWidth: 1180, margin: '0 auto' }}>
        <p className="eyebrow" style={{ textAlign: 'center' }}>Features</p>
        <h2 className="title" style={{ textAlign: 'center', fontSize: 'clamp(28px,4vw,44px)' }}>
          Everything you need to <em>build your career</em>
        </h2>
        <p className="subtitle" style={{ textAlign: 'center', margin: '0 auto 8px' }}>
          Personalized learning, progress tracking, and roadmap guidance — in one forge.
        </p>
        <div className="feat-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="card lift">
              <span className="iconbox" style={{ marginBottom: 14 }}>{f.icon}</span>
              <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{f.title}</h3>
              <p className="small" style={{ margin: 0, lineHeight: 1.6 }}>{f.text}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 40, textAlign: 'center', padding: '44px 28px' }}>
          <h2 className="serif" style={{ margin: '0 0 10px', fontSize: 30 }}>
            Ready to forge your path?
          </h2>
          <p className="subtitle" style={{ textAlign: 'center', margin: '0 auto 24px' }}>
            Create your free account and get your AI roadmap in minutes.
          </p>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: 15 }}>
            Get Started Free
          </Link>
        </div>

        <p className="dim" style={{ textAlign: 'center', fontSize: 12.5, marginTop: 36 }}>
          © {new Date().getFullYear()} PathForge. Forge your learning journey.
        </p>
      </section>
    </div>
  );
}

export default Landing;
