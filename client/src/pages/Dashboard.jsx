import { useEffect, useState } from 'react';
import axios from 'axios';
// 1. You MUST import the form component at the top!
import OnboardingForm from '../components/OnboardingForm';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        'http://localhost:5000/api/dashboard',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboardData(response.data);

    } catch (error) {

      if (error.response?.status === 401) {

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        navigate('/login');

      } else {

        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  // Remove the `if(true)` and put the real database check back!
  if (dashboardData.needsOnboarding) {
    return <OnboardingForm onComplete={fetchDashboard} />;
  }
  return (
    <DashboardLayout name={dashboardData.name} >
      {/* <Navbar name={dashboardData.name} /> */}
  
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-6">
          Welcome {dashboardData.name} 👋
        </h1>

        <div className="grid grid-cols-2 gap-6">


          <div className="grid grid-cols-2 gap-6">

            <div className="p-6 rounded-2xl shadow bg-white">
              <h2 className="text-xl font-semibold">
                🎯 Target Role
              </h2>

              <p className="mt-2 text-lg">
                {dashboardData.targetRole}
              </p>
            </div>

            <div className="p-6 rounded-2xl shadow bg-white">
              <h2 className="text-xl font-semibold">
                🔥 Current Streak
              </h2>

              <p className="mt-2 text-lg">
                {dashboardData.streak} Days
              </p>
            </div>

            <div className="p-6 rounded-2xl shadow bg-white">
              <h2 className="text-xl font-semibold">
                📚 Current Phase
              </h2>

              <p className="mt-2 text-lg">
                 
                {dashboardData.currentPhase}
              </p>
            </div>

            <div className="p-6 rounded-2xl shadow bg-white">
              <h2 className="text-xl font-semibold">
                📌 Next Task
              </h2>

              <p className="mt-2 text-lg">
                {dashboardData.nextTask}
              </p>
            </div>

            <div className="p-6 rounded-2xl shadow bg-white col-span-2">

              <div className="flex justify-between mb-3">

                <h2 className="text-xl font-semibold">
                  📈 Progress
                </h2>

                <span className="font-bold text-blue-600">
                  {dashboardData.progress}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-5">

                <div
                  className="bg-blue-600 h-5 rounded-full transition-all duration-500"
                  style={{
                    width: `${dashboardData.progress}%`,
                  }}
                ></div>

              </div>

              <p className="mt-4 text-lg">
                ✅ {dashboardData.completedTasks} / {dashboardData.totalTasks} Tasks Completed
              </p>

            </div>

            <div className="p-6 rounded-2xl shadow bg-white col-span-2">

              <h2 className="text-xl font-semibold mb-2">
                🚀 Roadmap Status
              </h2>

              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                {dashboardData.status}
              </span>

            </div>

          </div>

        </div>
      </div>
      </DashboardLayout>
  );
}

export default Dashboard;