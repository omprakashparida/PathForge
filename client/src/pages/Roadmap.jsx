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
      {/* <Navbar name={userName} /> */}

      <div className="p-10 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">
          {roadmap.title}
        </h1>

        <div className="space-y-8">

          {roadmap.phases.map((phase, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow"
            >

              <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Phase {phase.phase}: {phase.title}
              </h2>

              <div className="space-y-3">

                {phase.tasks.map((task, taskIndex) => (

                  <div
                    key={taskIndex}
                    className="flex items-center justify-between border p-4 rounded-xl"
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-xl">
                        {task.completed ? '✅' : '⬜'}
                      </span>

                      <p className="text-lg">
                        {task.task}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        markTaskComplete(
                          phase.phase,
                          task.task
                        )
                      }

                      disabled={task.completed}

                      className={`px-4 py-2 rounded-lg text-white font-semibold ${task.completed
                          ? 'bg-gray-500'
                          : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                      {task.completed
                        ? 'Completed ✅'
                        : 'Complete'}
                    </button>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>

      </div>
      </DashboardLayout>
  );
}

export default Roadmap;