import React, { useEffect, useState } from "react";
import { Sparkles, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SessionLoader = ({ loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    // Beautiful loading animation
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6" style={{ height: "100vh", background: '#0A0A1F', color: '#F5F5F5' }}>
        <Sparkles size={64} className="animate-pulse text-[#00FFFF] drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]" />
        <h2 className="text-2xl font-bold" style={{ color: '#F5F5F5' }}>Loading Session...</h2>
        <p style={{ color: '#8C8CA8', maxWidth: '400px' }}>Hang tight! We’re fetching your AI-generated notes and quizzes.</p>
        <div className="w-16 h-1 bg-[#00FFFF] rounded-full animate-pulse" />
      </div>
    );
  }

  if (error) {
    // Session not found
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6" style={{ height: "100vh", background: '#0A0A1F', color: '#F5F5F5' }}>
        <Sparkles size={64} style={{ color: '#A020F0' }} className="drop-shadow-[0_0_12px_rgba(160,32,240,0.6)]" />
        <h2 className="text-3xl font-bold" style={{ color: '#F5F5F5' }}>Session Not Found</h2>
        <p style={{ color: '#8C8CA8', maxWidth: '400px' }}>Sorry! The session you requested doesn’t exist or has expired.</p>
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
  }

  // If not loading or error, render children
  return null;
};

export default SessionLoader;
