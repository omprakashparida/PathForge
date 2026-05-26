export default function LoadingRadar() {
    return (
      <div className="flex items-center gap-3 justify-center">
        <div className="relative flex h-5 w-5 items-center justify-center">
          {/* The expanding outer ring */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          {/* The solid inner dot */}
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </div>
        <span className="font-semibold tracking-wide">Processing...</span>
      </div>
    );
  }