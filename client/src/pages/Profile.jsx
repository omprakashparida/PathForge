import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import PageLoader from '../components/PageLoader';
import LoadingRadar from '../components/LoadingRadar';

function Profile() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

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
      toast.error("Connection timed out. Redirecting to dashboard...");
      navigate('/dashboard');
    }, 10000);

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { clearTimeout(timeoutId); navigate('/login'); return; }

        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.profile) {
          setFormData(response.data.profile);
          setIsEdit(true);
          if (response.data.profile.updatedAt) {
            const daysSince = (new Date() - new Date(response.data.profile.updatedAt)) / (1000 * 60 * 60 * 24);
            if (daysSince < 14) setIsLocked(true);
          }
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem('accessToken');
          navigate('/login');
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
      const token = localStorage.getItem('accessToken');
      let response;
      if (isEdit) {
        response = await axios.put('/api/profile/update', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post('/api/profile/create', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.post('/api/roadmap/generate', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsLocked(true);
      toast.success(response.data.message || "Profile saved successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) return <PageLoader />;

  const inputStyle = "w-full bg-gray-800/80 border border-gray-700 px-4 py-3 rounded-2xl text-white text-sm sm:text-base outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-900";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>

      {/* Page Content */}
      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 sm:px-6 py-6 sm:py-10">

        <div className="w-full max-w-3xl">

          {/* Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(59,130,246,0.1)]">

            {/* Back Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-all duration-200 text-sm sm:text-base group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              Back to Dashboard
            </button>

            {/* Header */}
            <div className="mb-7 sm:mb-10">

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {isEdit ? "Edit Your" : "Complete Your"}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {" "}Profile
                </span>
                {" "}🚀
              </h1>

              {/* Lock Notice */}
              {isLocked && isEdit ? (
                <div className="mt-5 bg-blue-900/20 border border-blue-500/20 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-lg">
                      🔒
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-blue-300 font-semibold text-sm sm:text-base">
                        Some fields are locked for 14 days
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed">
                        To keep your AI roadmap consistent, roadmap-linked fields are temporarily locked.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {['🏫 College', '📚 Branch', '🎓 Year'].map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed">
                  Customize your learning journey and help AI generate better roadmaps.
                </p>
              )}

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Row 1 — College + Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="college"
                  placeholder="🏫 College"
                  value={formData.college}
                  onChange={handleChange}
                  className={inputStyle}
                />
                <input
                  type="text"
                  name="branch"
                  placeholder="📚 Branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              {/* Row 2 — Year + Target Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="year"
                  placeholder="🎓 Current Year (e.g. 2)"
                  value={formData.year}
                  onChange={handleChange}
                  className={inputStyle}
                />
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  disabled={isLocked && isEdit}
                  className={inputStyle}
                >
                  <option value="">🎯 Select Target Role</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                </select>
              </div>

              {/* Row 3 — Skill Level + Daily Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="currentSkillLevel"
                  placeholder="⚡ Skill Level (e.g. Beginner)"
                  value={formData.currentSkillLevel}
                  onChange={handleChange}
                  disabled={isLocked && isEdit}
                  className={inputStyle}
                />
                <input
                  type="number"
                  name="dailyAvailableHours"
                  placeholder="⏰ Daily Available Hours"
                  value={formData.dailyAvailableHours}
                  onChange={handleChange}
                  disabled={isLocked && isEdit}
                  className={inputStyle}
                />
              </div>

              {/* Row 4 — Interests + Goal Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="interests"
                  placeholder="❤️ Interests (e.g. Gaming, Music)"
                  value={formData.interests}
                  onChange={handleChange}
                  disabled={isLocked && isEdit}
                  className={inputStyle}
                />
                <input
                  type="text"
                  name="goalTimeline"
                  placeholder="🎯 Goal Timeline (e.g. 6 months)"
                  value={formData.goalTimeline}
                  onChange={handleChange}
                  disabled={isLocked && isEdit}
                  className={inputStyle}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full h-12 sm:h-14 rounded-2xl flex justify-center items-center
                    font-bold text-sm sm:text-base transition-all duration-300
                    ${isSubmitting
                      ? "bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] text-white"
                    }
                  `}
                >
                  {isSubmitting ? <LoadingRadar /> : isEdit ? "Update Profile 🚀" : "Create Profile 🚀"}
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;