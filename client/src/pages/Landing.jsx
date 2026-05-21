import Navbar from '../components/Navbar';

function Landing() {
  return (
    <div>
      <Navbar />

      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
        <h1 className="text-5xl font-bold mb-6">
          Build Your Career Path with AI
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          PathForge helps students generate personalized
          learning roadmaps, track progress, and stay
          consistent in their tech journey.
        </p>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Landing;