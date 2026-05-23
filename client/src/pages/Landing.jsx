import { Link } from 'react-router-dom';
import BorderGlow from '../components/BorderGlow';
function Landing() {
  return (
    <>

      <section className="relative overflow-hidden min-h-screen flex items-center px-10">

        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        {/* Glow effects */}

        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>

        {/* Top Navbar */}

        <div className="absolute top-0 left-0 w-full px-10 py-6 z-20 flex justify-between items-center">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PathForge
          </h1>

          <div className="flex items-center gap-5">

            <Link
              to="/login"
              className="font-semibold text-white hover:text-blue-400 px-3 py-2 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:scale-105 transition"
            >
              Sign Up
            </Link>

          </div>

        </div>


        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center w-full">

          {/* LEFT SIDE */}

          <div>

            <p className="text-blue-600 font-semibold mb-4">

              🚀 Personalized Learning Platform

            </p>

            <h1 className="text-6xl font-bold leading-tight text-white max-w-[700px]">

              Forge Your <br />

              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">

                {" "}Learning Journey

              </span>

            </h1>

            <p className="mt-6 text-gray-300 text-lg">

              AI-powered learning roadmaps tailored
              to your goals.

              Track progress, maintain streaks,
              and achieve your dream career.

            </p>


            <div className="flex gap-5 mt-8">

              <Link
                to="/signup"
                className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:scale-105 transition"
              >
                Start Learning
              </Link>

              <a
                href="#features"
                className="px-8 py-4 rounded-xl border border-gray-600 text-white hover:bg-white hover:text-black transition"
              >
                Explore Features
              </a>

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="relative">

            <BorderGlow
              borderRadius={28}
              glowRadius={35}
              glowIntensity={1.2}
              animated={true}
              colors={[
                '#3b82f6',
                '#8b5cf6',
                '#ec4899'
              ]}
            >

              <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 text-white">

                <h2 className="text-2xl font-bold mb-6 text-white">
                  Dashboard Preview
                </h2>

                <div className="space-y-5">

                  <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                    🎯 Full Stack Developer
                  </div>

                  <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                    🔥 5 Day Streak
                  </div>

                  <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">

                    📈 Progress 45%

                    <div className="w-full bg-gray-700 rounded-full h-3 mt-3">

                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: '45%' }}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </BorderGlow>

          </div>

        </div>



      </section>


      <section
        id="features"
        className="py-28 px-10 bg-white"
      >

        <div className="text-center mb-16">

          <p className="text-blue-600 font-semibold mb-3">
            FEATURES
          </p>

          <h2 className="text-5xl font-bold">
            Everything You Need To
            Build Your Career
          </h2>

          <p className="text-gray-500 mt-5">
            Personalized learning,
            progress tracking,
            and roadmap guidance.
          </p>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl shadow hover:scale-105 transition duration-300">

            <div className="text-4xl mb-4">
              🎯
            </div>

            <h3 className="font-bold text-xl mb-3">
              Personalized Roadmaps
            </h3>

            <p className="text-gray-600">
              Get customized learning paths based on your goals.
            </p>

          </div>


          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl shadow hover:scale-105 transition duration-300">

            <div className="text-4xl mb-4">
              🔥
            </div>

            <h3 className="font-bold text-xl mb-3">
              Daily Streaks
            </h3>

            <p className="text-gray-600">
              Stay consistent and build learning habits.
            </p>

          </div>


          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl shadow hover:scale-105 transition duration-300">

            <div className="text-4xl mb-4">
              📈
            </div>

            <h3 className="font-bold text-xl mb-3">
              Progress Tracking
            </h3>

            <p className="text-gray-600">
              Monitor learning progress visually.
            </p>

          </div>


          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl shadow hover:scale-105 transition duration-300">

            <div className="text-4xl mb-4">
              🗺
            </div>

            <h3 className="font-bold text-xl mb-3">
              Interactive Journey
            </h3>

            <p className="text-gray-600">
              Complete tasks and follow your roadmap.
            </p>

          </div>

        </div>

      </section>

    </>


  );
}

export default Landing;