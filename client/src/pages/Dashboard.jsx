import { useEffect, useState } from 'react';
import axios from 'axios';
import OnboardingForm from '../components/OnboardingForm';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import DashboardLayout from '../layouts/DashboardLayout';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [tip, setTip] = useState('');
  const [tipLoading, setTipLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        '/api/dashboard',
        { headers: { Authorization: `Bearer ${token}` } }
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

  const fetchTip = async (role, phase) => {
    setTipLoading(true);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful mentor. Every time you are asked, give a DIFFERENT tip than before. Never repeat yourself.'
            },
            {
              role: 'user',
              content: `Give me one single complete tip (1-2 sentences max, must end with a period) for someone learning to become a ${role} in phase ${phase}. Be specific and actionable. Never cut off mid sentence. Tip #${Math.floor(Math.random() * 10000)}.`
            }
          ],
          max_tokens: 80,
          temperature: 1.0,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setTip('Stay consistent! Even 30 minutes of focused practice daily will compound into expertise over time.');
        return;
      }
      setTip(data.choices[0].message.content);
    } catch (error) {
      setTip('Stay consistent! Even 30 minutes of focused practice daily will compound into expertise over time.');
    } finally {
      setTipLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  useEffect(() => {
    if (dashboardData) {
      fetchTip(dashboardData.targetRole, dashboardData.currentPhase);
    }
  }, [dashboardData]);

  if (!dashboardData) return <PageLoader />;
  if (dashboardData.needsOnboarding) return <OnboardingForm onComplete={fetchDashboard} />;

  return (
    <DashboardLayout name={dashboardData.name}>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute top-10 left-10 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>

  
        {/* Welcome Section */}
     

        <div className="relative z-10 mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Welcome back,
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {" "}{dashboardData.name}
            </span>
            {" "}👋
          </h1>
          <p className="text-gray-400 mt-2 sm:mt-3 text-base sm:text-lg">
            Keep building your journey 🚀
          </p>
        </div>

     
        {/* Dashboard Cards */}
     

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

          {/* Target */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-5 sm:p-6 hover:-translate-y-2 transition duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <h2 className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base">🎯 Target Role</h2>
            <p className="text-lg sm:text-xl font-bold">{dashboardData.targetRole}</p>
          </div>

          {/* Streak */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-5 sm:p-6 hover:-translate-y-2 transition duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <h2 className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base">🔥 Current Streak</h2>
            <p className="text-2xl sm:text-3xl font-bold">
              {dashboardData.streak}
              <span className="text-base sm:text-lg text-gray-400"> Days</span>
            </p>
          </div>

          {/* Phase */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-5 sm:p-6 hover:-translate-y-2 transition duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <h2 className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base">📚 Current Phase</h2>
            <p className="text-lg sm:text-xl font-bold">{dashboardData.currentPhase}</p>
          </div>

          {/* Next Task */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-5 sm:p-6 hover:-translate-y-2 transition duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <h2 className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base">📌 Next Task</h2>
            <p className="text-base sm:text-lg">{dashboardData.nextTask}</p>
          </div>

        </div>

     
        {/* Progress + Status */}
   

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-8">

          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-8">
            <div className="flex justify-between mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-bold">📈 Progress Overview</h2>
              <span className="text-blue-400 font-bold">{dashboardData.progress}%</span>
            </div>
            <div className="w-full h-4 sm:h-5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000"
                style={{ width: `${dashboardData.progress}%` }}
              ></div>
            </div>
            <p className="mt-4 sm:mt-5 text-gray-400 text-sm sm:text-base">
              ✅ {dashboardData.completedTasks} / {dashboardData.totalTasks} Tasks completed
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">🚀 Roadmap Status</h2>
            <span className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-green-500/20 text-green-400 font-bold text-sm sm:text-base">
              {dashboardData.status}
            </span>
          </div>

        </div>

     
        {/* AI Daily Tip */}
  

        <div className="relative z-10 mt-4 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">💡 AI Daily Tip</h2>

          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-8 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition duration-300">

            {tipLoading ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <p className="text-gray-400 text-sm sm:text-base">Generating your personalized tip...</p>
              </div>
            ) : (
              <div className="flex gap-3 sm:gap-5">
                <span className="text-2xl sm:text-4xl flex-shrink-0">🤖</span>
                <div>
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed">{tip}</p>
                  <button
                    onClick={() => fetchTip(dashboardData.targetRole, dashboardData.currentPhase)}
                    className="mt-3 sm:mt-4 text-blue-400 text-xs sm:text-sm hover:text-blue-300 transition"
                  >
                    🔄 Get another tip
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;