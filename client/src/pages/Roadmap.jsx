import { useEffect, useState } from 'react';
import axios from 'axios';
import PageLoader from '../components/PageLoader';
import DashboardLayout from '../layouts/DashboardLayout';
import toast from 'react-hot-toast';
function Roadmap() {

  const [roadmap, setRoadmap] = useState(null);

  const [userName, setUserName] = useState('');

  const [loading, setLoading] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);

  const fetchRoadmap = async () => {

    try {

      const token = localStorage.getItem(
        'accessToken'
      );

      const response = await axios.get(

        '/api/roadmap',

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );

      setRoadmap(
        response.data.roadmap
      );

      setUserName(
        response.data.name
      );

    }
    catch (error) {

      if (

        error.response?.status !== 404

      ) {

        console.log(error);

      }

    }
    finally {

      setLoading(false);

    }

  };

  const handleGenerateRoadmap = async () => {

    try {

      setIsGenerating(true);

      const token = localStorage.getItem(
        'accessToken'
      );

      const response = await axios.post(

        '/api/roadmap/generate',

        {},

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );

      toast.success(
        response.data.message
      );

      fetchRoadmap();

    }
    catch (error) {

      toast.error(

        error.response?.data?.message ||

        'Failed generating roadmap'

      );

    }
    finally {

      setIsGenerating(false);

    }

  };

  const markTaskComplete = async (
    phase,
    task
  ) => {

    try {

      const token = localStorage.getItem('accessToken');

      await axios.put(
        '/api/roadmap/complete-task',
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

  if (loading) {
    return <PageLoader />;
  }

  if (!roadmap) {

    return (

      <DashboardLayout>

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center px-5">

          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center">

            <h1 className="text-3xl font-bold text-white mb-4">

              🚀 Generate AI Roadmap

            </h1>

            <p className="text-gray-400 mb-8">

              Create a personalized roadmap based on your profile.

            </p>

            <button

              onClick={handleGenerateRoadmap}

              disabled={isGenerating}

              className={`
  
  w-full
  h-14
  rounded-xl
  font-semibold
  transition-all
  duration-300
  
  ${isGenerating

                  ? "bg-blue-800 cursor-not-allowed opacity-80"

                  : "bg-blue-600 hover:scale-[1.02] text-white"
                }
  
  `}

            >

              {
                isGenerating

                  ? "Generating AI Roadmap..."

                  : "Generate Roadmap"
              }

            </button>

          </div>

        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout name={userName}>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black px-4 sm:px-6 lg:px-10 py-8 relative overflow-hidden">


        {/* ========================== */}
        {/* Background Glow Effects */}
        {/* ========================== */}

        <div className="absolute top-10 left-5 lg:top-20 lg:left-20 w-60 lg:w-96 h-60 lg:h-96 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>

        <div className="absolute bottom-10 right-5 lg:bottom-20 lg:right-20 w-60 lg:w-96 h-60 lg:h-96 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>


        <div className="relative z-10">


          {/* ========================== */}
          {/* Header Section */}
          {/* ========================== */}

          <div className="mb-8 lg:mb-10 text-center lg:text-left">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">

              🗺

              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">

                {" "}{roadmap.title}

              </span>

            </h1>

            <p className="text-gray-400 mt-3 text-base lg:text-lg">

              Track your journey and complete milestones 🚀

            </p>

          </div>


          {/* ========================== */}
          {/* Progress Card */}
          {/* ========================== */}

          <div className="mb-10 bg-gray-900/80 border border-gray-800 rounded-3xl p-5 lg:p-8 backdrop-blur-xl">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-bold">

                Overall Progress

              </h2>

              <span className="text-blue-400 font-bold">

                {roadmap.progress || 0}%

              </span>

            </div>


            <div className="w-full h-4 rounded-full bg-gray-700 overflow-hidden">

              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000"
                style={{
                  width: `${roadmap.progress || 0}%`
                }}
              ></div>

            </div>

          </div>


          {/* ========================== */}
          {/* Phases */}
          {/* ========================== */}

          <div className="space-y-8">

            {roadmap.phases.map((phase, index) => (

              <div
                key={index}
                className="relative bg-gray-900/80 border border-gray-800 rounded-3xl p-5 lg:p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition duration-500"
              >


                {/* Timeline Dot */}

                <div className="hidden lg:block absolute -left-4 top-10 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>


                {/* ========================== */}
                {/* Phase Title */}
                {/* ========================== */}

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6">

                  Phase {phase.phase}

                  <span className="text-blue-400">

                    {" "}• {phase.title}

                  </span>

                </h2>


                {/* ========================== */}
                {/* Tasks */}
                {/* ========================== */}

                <div className="space-y-4">

                  {phase.tasks.map((task, taskIndex) => (

                    <div
                      key={taskIndex}
                      className={`
    
    flex flex-col lg:flex-row
    gap-4
    justify-between
    lg:items-center
    p-5
    rounded-2xl
    border
    transition-all
    duration-300
    hover:scale-[1.01]
    
    ${task.completed

                          ? "bg-green-500/10 border-green-500"

                          : "bg-gray-800 border-gray-700 hover:border-blue-500"

                        }
    
    `}
                    >


                      {/* Left Content */}

                      <div className="flex gap-4 flex-1 items-start">

                        <div className="text-2xl shrink-0">

                          {task.completed ? "✅" : "📌"}

                        </div>


                        <p
                          className={`
    
    text-base sm:text-lg
    
    ${task.completed

                              ? "text-green-400 line-through"

                              : "text-white"

                            }
    
    `}
                        >

                          {task.task}

                        </p>

                      </div>


                      {/* Button */}

                      <button

                        onClick={() => markTaskComplete(
                          phase.phase,
                          task.task
                        )}

                        disabled={task.completed}

                        className={`
    
    w-full lg:w-auto
    py-3
    px-6
    min-w-[170px]
    rounded-2xl
    font-semibold
    transition-all
    duration-300
    
    ${task.completed

                            ? "bg-gray-700 text-white"

                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105"

                          }
    
    `}
                      >

                        {task.completed

                          ? "Completed ✅"

                          : "Complete Task"}

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