import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
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

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem('accessToken');

        const response = await axios.get(
          '/api/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFormData(response.data.profile);

        setIsEdit(true);

      }
      catch (error) {

        console.log(error);

      }
      finally {

        setLoading(false);

      }

    };

    fetchProfile();

  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();
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

      toast.success(response.data.message);

      navigate('/dashboard');

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  if (loading) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-6 py-10 relative overflow-hidden">

      {/* ========================== */}
      {/* Background Glow Effects */}
      {/* ========================== */}

      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>


      {/* ========================== */}
      {/* Form Container */}
      {/* ========================== */}

      <div className="relative z-10 max-w-4xl mx-auto">

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 shadow-[0_0_50px_rgba(59,130,246,0.15)]">


          {/* ========================== */}
          {/* Back Button */}
          {/* ========================== */}

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition"
          >

            ← Back to Dashboard

          </button>


          {/* ========================== */}
          {/* Header */}
          {/* ========================== */}

          <div className="mb-10">

            <h1 className="text-5xl font-bold text-white">

              {isEdit ? "Edit Your" : "Complete Your"}

              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">

                {" "}Profile

              </span>

              🚀

            </h1>

            <p className="text-gray-400 mt-4">

              Customize your learning journey and help AI generate better roadmaps.

            </p>

          </div>


          {/* ========================== */}
          {/* Profile Form */}
          {/* ========================== */}

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6"
          >

            {/* College */}

            <input
              type="text"
              name="college"
              placeholder="🏫 College"
              value={formData.college}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white focus:border-blue-500 outline-none"
            />


            {/* Branch */}

            <input
              type="text"
              name="branch"
              placeholder="📚 Branch"
              value={formData.branch}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white focus:border-blue-500 outline-none"
            />


            {/* Year */}

            <input
              type="number"
              name="year"
              placeholder="🎓 Current Year"
              value={formData.year}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white focus:border-blue-500 outline-none"
            />


            {/* Target Role */}

            <select
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white focus:border-blue-500 outline-none"
            >

              <option value="">Select Target Role</option>

              <option value="Frontend Developer">
                Frontend Developer
              </option>

              <option value="Backend Developer">
                Backend Developer
              </option>

              <option value="Full Stack Developer">
                Full Stack Developer
              </option>

            </select>


            {/* Skill Level */}

            <input
              type="text"
              name="currentSkillLevel"
              placeholder="⚡ Skill Level"
              value={formData.currentSkillLevel}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white focus:border-blue-500 outline-none"
            />


            {/* Hours */}

            <input
              type="number"
              name="dailyAvailableHours"
              placeholder="⏰ Daily Available Hours"
              value={formData.dailyAvailableHours}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white focus:border-blue-500 outline-none"
            />


            {/* Interests */}

            <input
              type="text"
              name="interests"
              placeholder="❤️ Interests"
              value={formData.interests}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white focus:border-blue-500 outline-none"
            />


            {/* Timeline */}

            <input
              type="text"
              name="goalTimeline"
              placeholder="🎯 Goal Timeline"
              value={formData.goalTimeline}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-4 rounded-2xl text-white focus:border-blue-500 outline-none"
            />


            {/* ========================== */}
            {/* Submit Button */}
            {/* ========================== */}

            <div className="md:col-span-2">

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold hover:scale-[1.02] transition duration-300"
              >

                {isEdit ? "Update Profile" : "Create Profile"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );
}

export default Profile;