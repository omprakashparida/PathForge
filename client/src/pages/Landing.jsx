import { Link } from 'react-router-dom';
import BorderGlow from '../components/BorderGlow';

function Landing() {

return (

<>

{/* ========================== */}
{/* Hero Section */}
{/* ========================== */}

<section className="relative overflow-hidden min-h-screen flex items-center px-4 sm:px-6 md:px-10 py-24">

{/* Background */}

<div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>


{/* Glow effects */}

<div className="absolute top-10 left-5 md:top-20 md:left-20 w-52 md:w-72 h-52 md:h-72 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

<div className="absolute bottom-10 right-5 md:bottom-20 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>


{/* ========================== */}
{/* Navbar */}
{/* ========================== */}

<div className="absolute top-0 left-0 w-full px-4 sm:px-6 md:px-10 py-5 z-20 flex justify-between items-center">

<h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">

PathForge

</h1>


<div className="flex items-center gap-2 sm:gap-5">

<Link
to="/login"
className="font-semibold text-sm sm:text-base text-white hover:text-blue-400 px-2 sm:px-3 py-2 transition"
>

Login

</Link>


<Link
to="/signup"
className="bg-blue-600 text-white text-sm sm:text-base px-4 sm:px-5 py-2 rounded-xl hover:scale-105 transition"
>

Sign Up

</Link>

</div>

</div>


{/* ========================== */}
{/* Main Grid */}
{/* ========================== */}

<div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

{/* ========================== */}
{/* Left Content */}
{/* ========================== */}

<div className="text-center lg:text-left">

<p className="text-blue-500 font-semibold mb-4">

🚀 Personalized Learning Platform

</p>


<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">

Forge Your <br/>

<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">

Learning Journey

</span>

</h1>


<p className="mt-6 text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">

AI-powered learning roadmaps tailored
to your goals.

Track progress, maintain streaks,
and achieve your dream career.

</p>


<div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">

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


{/* ========================== */}
{/* Dashboard Preview */}
{/* ========================== */}

<div className="relative max-w-lg mx-auto w-full">

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

<div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-800 text-white">

<h2 className="text-xl md:text-2xl font-bold mb-6">

Dashboard Preview

</h2>


<div className="space-y-4">

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
style={{width:"45%"}}
/>

</div>

</div>

</div>

</div>

</BorderGlow>

</div>

</div>

</section>


{/* ========================== */}
{/* Features Section */}
{/* ========================== */}

<section
id="features"
className="py-20 px-4 sm:px-6 md:px-10 bg-white"
>

<div className="text-center mb-16">

<p className="text-blue-600 font-semibold mb-3">

FEATURES

</p>

<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">

Everything You Need To
Build Your Career

</h2>

<p className="text-gray-500 mt-5">

Personalized learning,
progress tracking,
and roadmap guidance.

</p>

</div>


<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

{[
["🎯","Personalized Roadmaps","Get customized learning paths based on your goals."],
["🔥","Daily Streaks","Stay consistent and build learning habits."],
["📈","Progress Tracking","Monitor learning progress visually."],
["🗺","Interactive Journey","Complete tasks and follow your roadmap."]
].map((item,index)=>(

<div
key={index}
className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl shadow hover:scale-105 transition duration-300"
>

<div className="text-4xl mb-4">

{item[0]}

</div>

<h3 className="font-bold text-xl mb-3">

{item[1]}

</h3>

<p className="text-gray-600">

{item[2]}

</p>

</div>

))}

</div>

</section>

</>

);

}

export default Landing;