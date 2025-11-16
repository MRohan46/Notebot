import React from "react";
import { Home, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0A0A1F', color: '#F5F5F5' }}>
      <Sparkles size={80} style={{ color: '#00FFFF' }} className="mb-6 drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]" />
      <h1 className="text-6xl font-bold mb-4" style={{ color: '#F5F5F5' }}>404</h1>
      <h2 className="text-2xl mb-6" style={{ color: '#8C8CA8' }}>Oops! Page Not Found</h2>
      <p className="mb-8 text-center" style={{ color: '#8C8CA8', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved. Return to the dashboard to continue your journey.
      </p>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-6 py-3 rounded font-semibold transition-all duration-300"
        style={{
          background: '#00FFFF',
          color: '#0A0A1F',
          boxShadow: '0 0 20px rgba(0,255,255,0.5)',
        }}
      >
        <Home size={20} /> Go Home
      </button>
    </div>
  );
};

export default PageNotFound;
