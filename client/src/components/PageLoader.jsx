function PageLoader() {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
  
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse">
            <span className="text-white font-black text-xl">PF</span>
          </div>
          <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PathForge
          </span>
        </div>
  
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
        </div>
  
        {/* Text */}
        <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse">
          Loading your journey...
        </p>
  
      </div>
    );
  }
  
  export default PageLoader;