import {  Sparkles } from 'lucide-react';

export const Header = ({page, sessionTitle, setSessionTitle, name}) => (
    <div className="fixed top-0 left-0 md:left-16 right-0 h-16 flex flex-col md:flex-row items-center justify-between px-4 md:px-8"
         style={{ background: '#181836', borderBottom: '1px solid rgba(0,255,255,0.2)' }}>
      <div className="flex items-center gap-4">
        <Sparkles size={28} style={{ color: '#00FFFF' }} className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
        <h1 className="text-2xl font-bold tracking-wide" style={{ color: '#F5F5F5' }}>
          NoteBot
        </h1>
      </div>
      
      {page === 'dashboard' && (
        <input 
          value={sessionTitle}
          onChange={(e) => setSessionTitle(e.target.value)}
          className="px-4 py-2 rounded bg-transparent border-b-2 outline-none transition-all text-center font-mono"
          style={{ 
            color: '#F5F5F5',
            borderColor: '#8C8CA8',
            width: '300px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#A020F0'}
          onBlur={(e) => e.target.style.borderColor = '#8C8CA8'}
        />
      )}
      
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
           style={{ background: 'linear-gradient(135deg, #00FFFF, #A020F0)', color: '#0A0A1F' }}>
        {name?.[0]}
      </div>
    </div>
  );