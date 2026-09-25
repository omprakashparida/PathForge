import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import PageLoader from '../components/PageLoader';
import DashboardLayout from '../layouts/DashboardLayout';

const RESOURCES = [
  { title: 'freeCodeCamp', desc: 'Free full-length courses on web dev, Python, and machine learning with certifications.', type: 'Course', icon: '🎓', url: 'https://www.freecodecamp.org' },
  { title: 'MDN Web Docs', desc: 'The definitive reference for HTML, CSS, and JavaScript.', type: 'Docs', icon: '📖', url: 'https://developer.mozilla.org' },
  { title: 'CS50x — Harvard', desc: 'Legendary intro to computer science, free on edX.', type: 'Course', icon: '🎓', url: 'https://cs50.harvard.edu/x/' },
  { title: 'The Odin Project', desc: 'Free full-stack curriculum with real projects.', type: 'Course', icon: '🎓', url: 'https://www.theodinproject.com' },
  { title: 'JavaScript.info', desc: 'Deep, modern JavaScript tutorial from basics to advanced.', type: 'Docs', icon: '📖', url: 'https://javascript.info' },
  { title: 'React Docs', desc: 'Official React documentation with interactive examples.', type: 'Docs', icon: '📖', url: 'https://react.dev' },
  { title: 'Fireship (YouTube)', desc: 'High-energy 100-second explainers and full courses.', type: 'Video', icon: '🎬', url: 'https://www.youtube.com/@Fireship' },
  { title: 'Traversy Media (YouTube)', desc: 'Project-based web dev tutorials for every level.', type: 'Video', icon: '🎬', url: 'https://www.youtube.com/@TraversyMedia' },
  { title: 'NeetCode', desc: 'The best way to grind data structures & algorithms for interviews.', type: 'Tool', icon: '🧰', url: 'https://neetcode.io' },
  { title: 'LeetCode', desc: 'The standard arena for coding interview practice.', type: 'Tool', icon: '🧰', url: 'https://leetcode.com' },
  { title: 'roadmap.sh', desc: 'Community-driven developer roadmaps for every role.', type: 'Tool', icon: '🧰', url: 'https://roadmap.sh' },
  { title: 'Eloquent JavaScript', desc: 'Free online book — a deep dive into the language.', type: 'Book', icon: '📕', url: 'https://eloquentjavascript.net' },
  { title: "You Don't Know JS", desc: 'Book series on the deep mechanics of JavaScript.', type: 'Book', icon: '📕', url: 'https://github.com/getify/You-Dont-Know-JS' },
  { title: 'Grokking the System Design Interview', desc: 'The classic prep guide for system design rounds.', type: 'Book', icon: '📕', url: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
  { title: 'Kaggle Learn', desc: 'Free micro-courses on Python, ML, and data viz.', type: 'Course', icon: '🎓', url: 'https://www.kaggle.com/learn' },
  { title: 'Dev.to Community', desc: 'Developer blog community full of tutorials and war stories.', type: 'Community', icon: '💬', url: 'https://dev.to' },
  { title: 'Stack Overflow', desc: 'Where every error message has already been asked.', type: 'Community', icon: '💬', url: 'https://stackoverflow.com' },
  { title: 'Exercism', desc: 'Code practice with free human mentorship in 70+ languages.', type: 'Tool', icon: '🧰', url: 'https://exercism.org' },
];

const FILTERS = ['All', 'Course', 'Video', 'Docs', 'Book', 'Tool', 'Community'];

function Resources() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/api/dashboard')
      .then((res) => { if (res.data?.name) setName(res.data.name); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      const matchesFilter = filter === 'All' || r.type === filter;
      const matchesQuery = !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  if (loading) return <PageLoader />;

  return (
    <DashboardLayout name={name}>
      <p className="eyebrow">Resources</p>
      <h1 className="title">
        The <em>armory</em>
      </h1>
      <p className="subtitle">
        Curated courses, docs, videos and tools to sharpen your skills. Pick a weapon.
      </p>

      <div className="searchbar" style={{ marginBottom: 6 }}>
        <span className="s-ic">🔍</span>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources..."
        />
      </div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`fbtn${filter === f ? ' on' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <div className="big">📭</div>
          <h2 className="serif" style={{ margin: '0 0 8px' }}>Nothing in the armory matches</h2>
          <p className="small" style={{ margin: 0 }}>Try a different search or filter.</p>
        </div>
      ) : (
        <div className="res-grid">
          {results.map((r) => (
            <a key={r.title} href={r.url} target="_blank" rel="noreferrer" className="card lift res">
              <div className="res-top">
                <span className="iconbox">{r.icon}</span>
                <span className="badge">{r.type}</span>
              </div>
              <h3 className="res-title">{r.title}</h3>
              <p className="res-desc">{r.desc}</p>
              <div className="res-foot">
                <span className="res-link">Open resource →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Resources;
