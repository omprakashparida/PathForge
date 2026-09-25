import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Dots } from './AuthBits';

const TARGET_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Software Engineer', 'AI Engineer', 'Data Scientist',
  'DevOps Engineer', 'Cloud Engineer', 'Cybersecurity Analyst',
  'Mobile App Developer',
];

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function OnboardingForm({ onComplete }) {
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/profile/create', formData);
      await api.post('/api/roadmap/generate', {});
      toast.success('Profile created successfully 🚀');
      onComplete();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap" style={{ alignItems: 'flex-start', paddingTop: 48 }}>
      <div className="glow-a" />
      <div className="glow-b" />
      <div className="auth-card" style={{ maxWidth: 720 }}>
        <div className="brand-row" style={{ marginBottom: 6 }}>
          <span className="mark">P</span>
          <span className="word">Path<em>Forge</em></span>
        </div>
        <h1 style={{ textAlign: 'center' }}>Complete Your Profile</h1>
        <p className="sub" style={{ textAlign: 'center' }}>
          Tell us about yourself so the AI can forge a roadmap that fits.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2" style={{ marginBottom: 4 }}>
            <div>
              <h3 className="serif" style={{ fontSize: 17, margin: '0 0 14px', color: 'var(--ember2)' }}>
                Education
              </h3>
              <Field label="College / University">
                <input type="text" name="college" required value={formData.college} onChange={handleChange}
                  placeholder="e.g. MIT" className="input" />
              </Field>
              <Field label="Branch / Major">
                <input type="text" name="branch" required value={formData.branch} onChange={handleChange}
                  placeholder="e.g. Computer Science" className="input" />
              </Field>
              <Field label="Current Year">
                <input type="number" name="year" value={formData.year} onChange={handleChange}
                  placeholder="e.g. 2" className="input" />
              </Field>
            </div>
            <div>
              <h3 className="serif" style={{ fontSize: 17, margin: '0 0 14px', color: 'var(--ember2)' }}>
                Career Goals
              </h3>
              <Field label="Target Role">
                <select name="targetRole" required value={formData.targetRole} onChange={handleChange} className="input">
                  <option value="">Select Target Role</option>
                  {TARGET_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Current Skill Level">
                <input type="text" name="currentSkillLevel" value={formData.currentSkillLevel} onChange={handleChange}
                  placeholder="e.g. Beginner" className="input" />
              </Field>
              <div className="grid grid-2">
                <Field label="Hours / Day">
                  <input type="number" name="dailyAvailableHours" min="1" max="16"
                    value={formData.dailyAvailableHours} onChange={handleChange}
                    placeholder="e.g. 3" className="input" />
                </Field>
                <Field label="Goal Timeline">
                  <input type="text" name="goalTimeline" value={formData.goalTimeline} onChange={handleChange}
                    placeholder="e.g. 6 months" className="input" />
                </Field>
              </div>
            </div>
          </div>

          <Field label="Specific Interests or Tech Stack">
            <input type="text" name="interests" value={formData.interests} onChange={handleChange}
              placeholder="e.g. React, Python, Machine Learning, UI/UX" className="input" />
          </Field>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ height: 52, marginTop: 8 }}>
            {loading ? <Dots /> : 'Save Profile & Enter Dashboard'}
          </button>
          <p className="dim" style={{ fontSize: 12.5, textAlign: 'center', marginTop: 12 }}>
            Saving also generates your first AI roadmap — this can take a few seconds.
          </p>
        </form>
      </div>
    </div>
  );
}

export default OnboardingForm;
