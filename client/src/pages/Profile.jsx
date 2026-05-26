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
  const [isLocked, setIsLocked] = useState(false); // 👈 New state for the 14-day lock

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      toast.error("Connection timed out. Redirecting to dashboard...");
      navigate('/dashboard');
    }, 10000);

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          clearTimeout(timeoutId);
          navigate('/login');
          return;
        }

        const response = await axios.get(
          '/api/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.profile) {
          setFormData(response.data.profile);
          setIsEdit(true);

          // ==========================================
          // 🔒 14-DAY COOLDOWN LOGIC
          // ==========================================
          // Make sure 'updatedAt' matches the timestamp field in your MongoDB Schema!
          if (response.data.profile.updatedAt) {
            const lastUpdate = new Date(response.data.profile.updatedAt);
            const now = new Date();
            const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

            if (daysSinceUpdate < 14) {
              setIsLocked(true);
            }
          }
        }

      } catch (error) {
        console.log("Fetch Profile Error:", error);

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
        response = await axios.put(
          '/api/profile/update',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          '/api/profile/create',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await axios.post(
          '/api/roadmap/generate',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // If they successfully update, refresh the lock state locally
      setIsLocked(true);
      toast.success(response.data.message || "Profile saved successfully!");
      navigate('/dashboard');

    } catch (error) {
      console.log("Submit Error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return <PageLoader />;
  }

  // Base styling for inputs to keep JSX clean
  const inputBaseStyle = "bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white outline-none transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 sm:px-6 lg:px-10 py-8 lg:py-10 relative overflow-hidden">

      <div className="absolute top-10 left-5 lg:top-20 lg:left-20 w-60 lg:w-96 h-60 lg:h-96 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-5 lg:bottom-20 lg:right-20 w-60 lg:w-96 h-60 lg:h-96 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(59,130,246,0.15)]">

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-all duration-300 hover:translate-x-1"
          >
            ← Back to Dashboard
          </button>

          <div className="mb-8 lg:mb-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {isEdit ? "Edit Your" : "Complete Your"}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {" "}Profile
              </span>
              🚀
            </h1>

            {/* 🔒 Show warning banner if the profile is in cooldown */}
            {isLocked && isEdit ? (
              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-xl max-w-2xl mx-auto lg:mx-0">
                <p className="text-blue-300 text-sm sm:text-base flex items-center gap-2">
                  <span className="text-xl">🔒</span>
                  Core roadmap fields are locked for 14 days after creation to stabilize your AI roadmap. You can still update College, Branch and Year.
                </p>
              </div>
            ) : (
              <p className="text-gray-400 mt-4 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0">
                Customize your learning journey and help AI generate better roadmaps.
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
          >
            {/* ========================================== */}
            {/* College - ALWAYS EDITABLE */}
            {/* ========================================== */}
            <input
              type="text"
              name="college"
              placeholder="🏫 College"
              value={formData.college}
              onChange={handleChange}
              disabled={false} // Never locked
              className={inputBaseStyle}
            />


            <input
              type="text"
              name="branch"
              placeholder="📚 Branch"
              value={formData.branch}
              onChange={handleChange}
              disabled={false}
              className={inputBaseStyle}
            />
            <input
              type="number"
              name="year"
              placeholder="🎓 Current Year"
              value={formData.year}
              onChange={handleChange}
              disabled={false}
              className={inputBaseStyle}
            />
            {/* ========================================== */}
            {/* ALL OTHER FIELDS - LOCKED IF 'isLocked' IS TRUE */}
            {/* ========================================== */}

            <select
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              disabled={isLocked && isEdit}
              className={inputBaseStyle}
            >
              <option value="">Select Target Role</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
            </select>

            <input
              type="text"
              name="currentSkillLevel"
              placeholder="⚡ Skill Level"
              value={formData.currentSkillLevel}
              onChange={handleChange}
              disabled={isLocked && isEdit}
              className={inputBaseStyle}
            />

            <input
              type="number"
              name="dailyAvailableHours"
              placeholder="⏰ Daily Available Hours"
              value={formData.dailyAvailableHours}
              onChange={handleChange}
              disabled={isLocked && isEdit}
              className={inputBaseStyle}
            />

            <input
              type="text"
              name="interests"
              placeholder="❤️ Interests"
              value={formData.interests}
              onChange={handleChange}
              disabled={isLocked && isEdit}
              className={inputBaseStyle}
            />

            <input
              type="text"
              name="goalTimeline"
              placeholder="🎯 Goal Timeline"
              value={formData.goalTimeline}
              onChange={handleChange}
              disabled={isLocked && isEdit}
              className={inputBaseStyle}
            />

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-14 rounded-2xl flex justify-center items-center font-bold transition-all duration-300
                  ${isSubmitting
                    ? "bg-gray-800 border border-gray-700 cursor-not-allowed opacity-90 text-gray-300"
                    : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-[1.02] text-white"
                  }`}
              >
                {isSubmitting ? (
                  <LoadingRadar />
                ) : (
                  isEdit ? "Update Profile" : "Create Profile"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;