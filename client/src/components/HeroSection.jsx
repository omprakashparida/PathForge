import { Link } from 'react-router-dom';

function HeroSection() {

  return (

    <section className="relative overflow-hidden min-h-screen flex items-center px-10">

      {/* Background gradient */}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>

      {/* Blurred circles */}

      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>

      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>


      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center w-full">

        {/* LEFT SIDE */}

        <div>

          <p className="text-blue-600 font-semibold mb-4">

            🚀 Personalized Learning Platform

          </p>

          <h1 className="text-6xl font-bold leading-tight">

            Forge Your

            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Learning Journey
            </span>

          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">

            AI-powered learning roadmaps tailored
            to your goals.

            Track progress, maintain streaks,
            and achieve your dream career.

          </p>


          <div className="flex gap-5 mt-8">

            <Link
              to="/signup"
              className="px-7 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:scale-105 transition"
            >
              Start Learning
            </Link>


            <button
              className="px-7 py-4 rounded-xl border border-gray-300 font-semibold hover:bg-white transition"
            >
              Explore Features
            </button>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="relative">

          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur">

            <h2 className="font-bold text-2xl mb-6">

              Dashboard Preview

            </h2>

            <div className="space-y-5">

              <div className="bg-gray-100 rounded-xl p-4">

                🎯 Full Stack Developer

              </div>

              <div className="bg-gray-100 rounded-xl p-4">

                🔥 5 Day Streak

              </div>

              <div className="bg-gray-100 rounded-xl p-4">

                📈 Progress 45%

                <div className="w-full bg-gray-300 rounded-full h-3 mt-3">

                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{
                      width:'45%'
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );
}

export default HeroSection;