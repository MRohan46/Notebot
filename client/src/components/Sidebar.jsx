import { Book, Plus, Home, SettingsIcon, MessageCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ setPage, setInputText, setOutput, setSessionTitle, page }) => {
    const navigate = useNavigate();
  return (
    <div className="fixed left-0 top-0 h-full w-16 flex flex-col items-center py-6 gap-8" 
         style={{ background: '#181836' }}>
      
      <button 
        onClick={() => setPage('dashboard')}
        className="relative group"
        title="Dashboard">
        <Home size={24} 
              style={{ color: page === 'dashboard' ? '#00FFFF' : '#F5F5F5' }}
              className="transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
      </button>
      
      <button 
        onClick={() => setPage('library')}
        className="relative group"
        title="Library">
        <Book size={24} 
              style={{ color: page === 'library' ? '#00FFFF' : '#F5F5F5' }}
              className="transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
      </button>
      <button 
        onClick={() => navigate("/chat")}
        className="relative group"
        title="Quick Chat">
        <MessageCircle size={24} 
              style={{ color: '#F5F5F5' }}
              className="transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
      </button>
      
      <button 
        onClick={() => setPage('settings')}
        className="relative group"
        title="Settings">
        <SettingsIcon size={24} 
              style={{ color: page === 'settings' ? '#00FFFF' : '#F5F5F5' }}
              className="transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
      </button>
      
      <div className="flex-1" />
      
      <button 
        onClick={() => {
          setPage('dashboard');
          setInputText('');
          setSessionTitle('Untitled Session');
        }}
        className="rounded-full p-3 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,255,255,0.8)]"
        style={{ background: '#00FFFF' }}
        title="New Session">
        <Plus size={24} style={{ color: '#0A0A1F' }} />
      </button>
    </div>
  );
};
