import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DashboardLayout from '../layouts/DashboardLayout';
function Roadmap() {

  const [roadmap, setRoadmap] = useState(null);

  const [userName, setUserName] = useState('');

  const fetchRoadmap = async () => {

    try {

      const token = localStorage.getItem('accessToken');

      const response = await axios.get(
        'http://localhost:5000/api/roadmap',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoadmap(response.data.roadmap);
      console.log(response.data.roadmap);
      setUserName(response.data.name);

    } catch (error) {

      console.log(error);
    }
  };

  const markTaskComplete = async (
    phase,
    task
  ) => {

    try {

      const token = localStorage.getItem('accessToken');

      await axios.put(
        'http://localhost:5000/api/roadmap/complete-task',
        {
          phase,
          task,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRoadmap();

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchRoadmap();

  }, []);

  if (!roadmap) {
    return <div>Loading...</div>;
  }

  return (

    <DashboardLayout name={userName}>
    
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black px-10 py-8 relative overflow-hidden">
    
    
    {/* ========================== */}
    {/* Background Glow Effects */}
    {/* ========================== */}
    
    <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
    
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>
    
    
    <div className="relative z-10">
    
    
    {/* ========================== */}
    {/* Header Section */}
    {/* ========================== */}
    
    <div className="mb-10">
    
    <h1 className="text-5xl font-bold text-white">
    
    🗺
    
    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
    
    {" "}{roadmap.title}
    
    </span>
    
    </h1>
    
    <p className="text-gray-400 mt-3 text-lg">
    
    Track your journey and complete milestones 🚀
    
    </p>
    
    </div>
    
    
    {/* ========================== */}
    {/* Overall Progress Card */}
    {/* ========================== */}
    
    <div className="mb-10 bg-gray-900/80 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl">
    
    <div className="flex justify-between mb-5">
    
    <h2 className="text-white text-2xl font-bold">
    
    Overall Progress
    
    </h2>
    
    <span className="text-blue-400 font-bold">
    
    {roadmap.progress || 0}%
    
    </span>
    
    </div>
    
    <div className="w-full h-5 rounded-full bg-gray-700 overflow-hidden">
    
    <div
    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000"
    style={{
    width:`${roadmap.progress || 0}%`
    }}
    ></div>
    
    </div>
    
    </div>
    
    
    {/* ========================== */}
    {/* Phases */}
    {/* ========================== */}
    
    <div className="space-y-10">
    
    {roadmap.phases.map((phase,index)=>(
    
    <div
    key={index}
    className="relative bg-gray-900/80 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition duration-500"
    >
    
    {/* Timeline Dot */}
    
    <div className="absolute -left-4 top-10 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
    
    
    {/* Phase Title */}
    
    <h2 className="text-3xl font-bold text-white mb-8">
    
    Phase {phase.phase}
    
    <span className="text-blue-400">
    
    {" "}• {phase.title}
    
    </span>
    
    </h2>
    
    
    {/* Tasks */}
    
    <div className="space-y-4">
    
    {phase.tasks.map((task,taskIndex)=>(
    
    <div
    key={taskIndex}
    className={`flex items-center justify-between p-5 rounded-2xl border transition duration-300 hover:scale-[1.01]
    
    ${task.completed
    
    ? "bg-green-500/10 border-green-500"
    
    : "bg-gray-800 border-gray-700 hover:border-blue-500"
    }`}
    >
    
    <div className="flex items-center gap-4">
    
    <div className="text-2xl">
    
    {task.completed ? "✅" : "📌"}
    
    </div>
    
    <p className={`text-lg
    
    ${task.completed
    
    ? "text-green-400 line-through"
    
    : "text-white"
    }`}>
    
    {task.task}
    
    </p>
    
    </div>
    
    
    <button
    
    onClick={()=>markTaskComplete(
    phase.phase,
    task.task
    )}
    
    disabled={task.completed}
    
    className={`px-6 py-3 rounded-xl font-semibold transition
    
    ${task.completed
    
    ? "bg-gray-600 text-white"
    
    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105"
    }`}
    >
    
    {task.completed
    
    ? "Completed ✅"
    
    : "Mark Complete"}
    
    </button>
    
    </div>
    
    ))}
    
    </div>
    
    </div>
    
    ))}
    
    </div>
    
    </div>
    
    </div>
    
    </DashboardLayout>
    
    );
}

export default Roadmap;