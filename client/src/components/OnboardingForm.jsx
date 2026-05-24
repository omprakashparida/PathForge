import { useState } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";

function OnboardingForm({ onComplete }) {
  const [formData, setFormData] = useState({
    college: '',
    branch: '',
    year: '1st Year',
    targetRole: '',
    currentSkillLevel: 'Beginner',
    dailyAvailableHours: 2,
    interests: '',
    goalTimeline: '6 Months'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const token = localStorage.getItem('accessToken');



      await axios.post(
        '/api/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      toast.success(
        "Profile created successfully 🚀"
      );

      onComplete();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

      console.error(
        "Error saving profile:",
        error
      );

    } finally {

      setLoading(false);
    }

  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <span className="text-4xl">🚀</span>
          <h2 className="text-3xl font-bold mt-3 text-slate-800">Complete Your Profile</h2>
          <p className="text-slate-500 mt-2">Help us customize your PathForge learning roadmap.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Education</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">College/University</label>
              <input type="text" name="college" required onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. MIT" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Branch/Major</label>
              <input type="text" name="branch" required onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Year of Study</label>
              <select name="year" onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500">
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Graduated</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Career Goals</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Role</label>
              <input type="text" name="targetRole" required onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Frontend Developer" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Current Skill Level</label>
              <select name="currentSkillLevel" onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Hours/Day</label>
                <input type="number" name="dailyAvailableHours" min="1" max="16" defaultValue="2" onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Timeline</label>
                <select name="goalTimeline" onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500">
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>1 Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Specific Interests or Tech Stack</label>
            <input type="text" name="interests" onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. React, Python, Machine Learning, UI/UX" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Saving Profile..." : "Save Profile & Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OnboardingForm;