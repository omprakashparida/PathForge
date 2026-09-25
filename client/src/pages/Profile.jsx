import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';
import DashboardLayout from '../layouts/DashboardLayout';
import { Dots } from '../components/AuthBits';

const TARGET_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Software Engineer', 'AI Engineer', 'Data Scientist',
  'DevOps Engineer', 'Cloud Engineer', 'Cybersecurity Analyst',
  'Mobile App Developer',
];

function Profile() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [userName, setUserName] = useState('');

  const [formData, setFormData] = useState({
    college: '',
    branch: '',
    year: '',
    targetRole: '',
    currentSkillLevel: '',
    dailyAvailableHours: '',
    interests: '',
    goalTimeline: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      toast.error('Connection timed out. Redirecting to dashboard...');
      navigate('/dashboard');
    }, 10000);

    const fetchProfile = async () => {
      try {
        if (!localStorage.getItem('accessToken')) { clearTimeout(timeoutId); navigate('/login'); return; }

        const response = await api.get('/api/profile');

        // Name for the rail menu — non-critical, never blocks the page.
        api.get('/api/dashboard')
          .then((r) => { if (r.data?.name) setUserName(r.data.name); })
          .catch(() => {});

        if (response.data.profile) {
          setFormData(response.data.profile);
          setIsEdit(true);
          const generatedAt = response.data.roadmap?.generatedAt;

          if (generatedAt) {
            const daysSince =
              (new Date() - new Date(generatedAt)) /
              (1000 * 60 * 60 * 24);

            if (daysSince < 14) {
              setIsLocked(true);
            } else {
              setIsLocked(false);
            }
          } else {
            setIsLocked(false);
          }
        }
      } catch (error) {
        // 401 here means the refresh already failed — the interceptor
        // cleared the session and redirected to /login.
        if (error.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
        }
      } finally {
        clearTimeout(timeoutId);
        setIsPageLoading(false);
      }
    };

    fetchProfile();
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let response;
      if (isEdit) {
        response = await api.put('/api/profile/update', formData);
      } else {
        response = await api.post('/api/profile/create', formData);
        await api.post('/api/roadmap/generate', {});
      }
      setIsLocked(true);
      toast.success(response.data.message || 'Profile saved successfully!');
      // The backend skips roadmap-linked fields during the 14-day lock and
      // reports them in `warning` instead of failing the whole save.
      if (response.data.warning) {
        toast(response.data.warning, { icon: '🔒', duration: 5000 });
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) return <PageLoader />;

  const locked = isLocked && isEdit;

  return (
    <DashboardLayout name={userName}>
      <p className="eyebrow">Profile</p>
      <h1 className="title">
        {isEdit ? 'Edit your' : 'Complete your'} <em>profile</em>
      </h1>
      <p className="subtitle">
        Customize your learning journey and help the AI forge better roadmaps.
      </p>

      {locked && (
        <div className="notice warn">
          <span style={{ fontSize: 20 }}>🔒</span>
          <div>
            <strong>Some fields are locked for 14 days</strong>
            <div className="small" style={{ marginTop: 4 }}>
              To keep your AI roadmap consistent, roadmap-linked fields are temporarily locked.
            </div>
            <div className="lock-tags">
              {['Target Role', 'Skill Level', 'Daily Hours', 'Interests', 'Timeline'].map((t) => (
                <span key={t} className="badge gold">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="field">
              <label className="field-label">College / University</label>
              <input type="text" name="college" value={formData.college} onChange={handleChange}
                placeholder="e.g. MIT" className="input" />
            </div>
            <div className="field">
              <label className="field-label">Branch / Major</label>
              <input type="text" name="branch" value={formData.branch} onChange={handleChange}
                placeholder="e.g. Computer Science" className="input" />
            </div>
            <div className="field">
              <label className="field-label">Current Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange}
                placeholder="e.g. 2" className="input" />
            </div>
            <div className="field">
              <label className="field-label">Target Role</label>
              <select name="targetRole" value={formData.targetRole} onChange={handleChange}
                disabled={locked} className="input">
                <option value="">Select Target Role</option>
                {TARGET_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Skill Level</label>
              <input type="text" name="currentSkillLevel" value={formData.currentSkillLevel}
                onChange={handleChange} disabled={locked}
                placeholder="e.g. Beginner" className="input" />
            </div>
            <div className="field">
              <label className="field-label">Daily Available Hours</label>
              <input type="number" name="dailyAvailableHours" value={formData.dailyAvailableHours}
                onChange={handleChange} disabled={locked}
                placeholder="e.g. 3" className="input" />
            </div>
            <div className="field">
              <label className="field-label">Interests</label>
              <input type="text" name="interests" value={formData.interests}
                onChange={handleChange} disabled={locked}
                placeholder="e.g. Gaming, Music" className="input" />
            </div>
            <div className="field">
              <label className="field-label">Goal Timeline</label>
              <input type="text" name="goalTimeline" value={formData.goalTimeline}
                onChange={handleChange} disabled={locked}
                placeholder="e.g. 6 months" className="input" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-block"
            style={{ height: 52, marginTop: 10 }}
          >
            {isSubmitting ? <Dots /> : isEdit ? 'Update Profile' : 'Create Profile & Generate Roadmap'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
