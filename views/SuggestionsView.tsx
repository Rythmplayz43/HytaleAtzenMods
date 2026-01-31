
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { Suggestion, SuggestionStatus } from '../types';

// Add missing upvotes and downvotes to mock data
const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: 's1',
    title: 'Hytale Furniture+',
    description: 'Mehr dekorative Blöcke für Häuser.',
    url: 'https://example.com/furniture',
    status: SuggestionStatus.PENDING,
    createdAt: Date.now() - 3600000,
    createdBy: 'user_123',
    creatorName: 'Hytale-Fan',
    upvotes: 0,
    downvotes: 0
  }
];

const SuggestionsView: React.FC = () => {
  // Fix: isAdmin is not directly on AuthContext, it's on the user object
  const { user } = useContext(AuthContext);
  const isAdmin = user?.isAdmin;
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', url: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add missing upvotes and downvotes to new suggestion
    const newSuggestion: Suggestion = {
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      status: SuggestionStatus.PENDING,
      createdAt: Date.now(),
      createdBy: user.uid,
      creatorName: user.displayName,
      upvotes: 0,
      downvotes: 0
    };
    setSuggestions([newSuggestion, ...suggestions]);
    setForm({ title: '', description: '', url: '' });
    setIsModalOpen(false);
  };

  const handleModerate = (id: string, status: SuggestionStatus) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status, reviewedAt: Date.now() } : s));
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mod Vorschläge</h1>
          <p className="text-slate-400">Reiche deine Ideen ein und diskutiere mit den Admins.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/20"
        >
          Vorschlag einreichen
        </button>
      </header>

      <div className="space-y-4">
        {suggestions.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700">
            <p className="text-slate-500">Noch keine Vorschläge vorhanden.</p>
          </div>
        )}
        
        {suggestions.map(s => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                    s.status === SuggestionStatus.PENDING ? 'bg-amber-500/10 text-amber-500' :
                    s.status === SuggestionStatus.ACCEPTED ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-rose-500/10 text-rose-500'
                  }`}>
                    {s.status}
                  </span>
                  <span className="text-xs text-slate-500">Von {s.creatorName} • {new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{s.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{s.description}</p>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs hover:underline flex items-center gap-1">
                  <i className="fas fa-link"></i> Link zur Mod
                </a>
              </div>

              {isAdmin && s.status === SuggestionStatus.PENDING && (
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleModerate(s.id, SuggestionStatus.REJECTED)}
                    className="p-2 w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <button 
                    onClick={() => handleModerate(s.id, SuggestionStatus.ACCEPTED)}
                    className="p-2 w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Neuer Vorschlag</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Titel</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  required
                  placeholder="z.B. Furniture Mod"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Beschreibung</label>
                <textarea 
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                  required
                  placeholder="Was macht diese Mod besonders?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">URL (Optional)</label>
                <input 
                  type="url" 
                  value={form.url}
                  onChange={e => setForm({...form, url: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="https://hytale-hub.com/mods/..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/20"
                >
                  Absenden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsView;