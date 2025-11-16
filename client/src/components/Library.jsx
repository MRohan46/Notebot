import { Trash2, Eye } from 'lucide-react';

export const Library = ({savedSessions, navigate, handleDelete}) => (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-wide" style={{ color: '#F5F5F5' }}>
          Knowledge Vault
        </h1>
      </div>
      
      <div className="space-y-3">
        {savedSessions.map(session => (
          <div key={session.id}
               className="rounded p-5 flex items-center gap-6 transition-all hover:translate-x-1 cursor-pointer"
               style={{ 
                 background: '#181836',
                 borderLeft: '4px solid #00FFFF'
               }}>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#F5F5F5' }}>
                {session.title}
              </h3>
              <p className="text-sm mb-2" style={{ color: '#8C8CA8' }}>
                {session.snippet}
              </p>
              <div className="flex gap-4 text-xs" style={{ color: '#8C8CA8' }}>
                <span>{session.date}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(160,32,240,0.2)', color: '#A020F0' }}>
                  Summary & Quizes
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="p-2 rounded transition-all hover:bg-opacity-20"
                style={{ background: 'rgba(0,255,255,0.1)', color: '#00FFFF' }}
                title="View">
                <Eye size={18} onClick={()=> navigate(`/library/${session.id}`)} />
              </button>
              
              <button 
                onClick={() => handleDelete(session.id)}
                className="p-2 rounded transition-all hover:bg-opacity-20"
                style={{ background: 'rgba(140,140,168,0.1)', color: '#8C8CA8' }}
                title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
