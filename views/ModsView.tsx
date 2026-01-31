
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import { Mod, ModStatus } from '../types';

const MOCK_MODS: Mod[] = [
  {
    id: '1',
    title: 'Advanced Farming',
    description: 'Fügt 50+ neue Pflanzen und ein automatisiertes Bewässerungssystem hinzu.',
    url: 'https://hytale.com/mods/farming',
    category: 'Content',
    status: ModStatus.ACTIVE,
    createdAt: Date.now() - 1000000,
    createdBy: 'Admin',
    voteCount: 12
  },
  {
    id: '2',
    title: 'Magic Overhaul',
    description: 'Ein komplettes Rework des Magiesystems mit Mana und Runen.',
    url: 'https://hytale.com/mods/magic',
    category: 'Gameplay',
    status: ModStatus.ACTIVE,
    createdAt: Date.now() - 5000000,
    createdBy: 'Admin',
    voteCount: 45
  }
];

const ModsView: React.FC = () => {
  // Fix: isAdmin is not directly on AuthContext, it's on the user object
  const { user } = useContext(AuthContext);
  const isAdmin = user?.isAdmin;
  const [mods, setMods] = useState<Mod[]>(MOCK_MODS);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('votes');
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set(['2'])); // Mock: user already voted for mod 2

  const sortedMods = [...mods]
    .filter(m => filter === 'all' || m.category.toLowerCase() === filter.toLowerCase())
    .sort((a, b) => {
      if (sortBy === 'votes') return b.voteCount - a.voteCount;
      return b.createdAt - a.createdAt;
    });

  const handleVote = (modId: string) => {
    if (userVotes.has(modId)) return;
    
    setUserVotes(prev => new Set([...prev, modId]));
    setMods(prev => prev.map(m => m.id === modId ? { ...m, voteCount: m.voteCount + 1 } : m));
    // In real app: Write to Firestore votes collection with modId_userId key
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Mod Voting</h1>
          <p className="text-slate-400">Stimme für deine Lieblings-Mods ab, die auf dem Server installiert werden sollen.</p>
        </div>
        
        {isAdmin && (
          <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
            <i className="fas fa-plus"></i> Mod hinzufügen
          </button>
        )}
      </header>

      <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">Filter:</span>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border-none rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Alle Kategorien</option>
            <option value="content">Content</option>
            <option value="gameplay">Gameplay</option>
            <option value="utility">Utility</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">Sortierung:</span>
          <button 
            onClick={() => setSortBy('votes')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${sortBy === 'votes' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            Top
          </button>
          <button 
            onClick={() => setSortBy('new')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${sortBy === 'new' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            Neu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedMods.map(mod => (
          <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all group">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-2xl bg-slate-800 shrink-0 overflow-hidden border border-slate-700">
                <img src={mod.imageUrl || `https://picsum.photos/seed/${mod.id}/200`} alt={mod.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-md">{mod.category}</span>
                  <span className="text-xs text-slate-500">{new Date(mod.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{mod.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{mod.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{mod.voteCount}</span>
                    <span className="text-sm text-slate-500 uppercase tracking-tighter">Votes</span>
                  </div>
                  
                  <button 
                    onClick={() => handleVote(mod.id)}
                    disabled={userVotes.has(mod.id)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                      userVotes.has(mod.id) 
                      ? 'bg-slate-800 text-slate-500 cursor-default' 
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 active:scale-95'
                    }`}
                  >
                    <i className={`fas ${userVotes.has(mod.id) ? 'fa-check' : 'fa-arrow-up'}`}></i>
                    {userVotes.has(mod.id) ? 'Voted' : 'Vote'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModsView;
