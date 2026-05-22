import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {

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
          'http://localhost:5000/api/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData(response.data.profile);

        setIsEdit(true);

      } catch (error) {
        console.log(error);
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
          'http://localhost:5000/api/profile/update',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } else {

        response = await axios.post(
          'http://localhost:5000/api/profile/create',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await axios.post(
          'http://localhost:5000/api/roadmap/generate',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert(response.data.message);

      navigate('/dashboard');

    } catch (error) {

      console.log(error);

      alert(error.response.data.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Complete Your Profile 🚀
        </h1>
        <input
          type="text"
          name="college"
          placeholder="College"
          value={formData.college}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />


        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="number"
          name="year"
          placeholder="Current Year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />


        <select
          name="targetRole"
          value={formData.targetRole}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        >

          <option value="">
            Select Target Role
          </option>

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

        <input
          type="text"
          name="currentSkillLevel"
          placeholder="Current Skill Level"
          value={formData.currentSkillLevel}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="number"
          name="dailyAvailableHours"
          placeholder="Daily Available Hours"
          value={formData.dailyAvailableHours}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />


        <input
          type="text"
          name="interests"
          placeholder="Interests"
          value={formData.interests}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />


        <input
          type="text"
          name="goalTimeline"
          placeholder="Goal Timeline"
          value={formData.goalTimeline}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {isEdit ? 'Update Profile' : 'Create Profile'}
        </button>

      </form>
    </div>
  );
}

export default Profile;