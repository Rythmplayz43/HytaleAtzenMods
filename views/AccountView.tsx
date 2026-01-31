
import React, { useContext, useState } from 'react';
import { AuthContext } from '../App';

const AccountView: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    // In real app: Update Firestore user profile
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-white">Dein Profil</h1>
        <p className="text-slate-400">Verwalte deine Identität im Hytale Hub.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="h-32 hytale-gradient"></div>
        <div className="px-8 pb-8 -mt-12">
          <div className="relative inline-block">
            <img 
              src={user?.avatarUrl || 'https://picsum.photos/200'} 
              className="w-24 h-24 rounded-3xl border-4 border-slate-900 bg-slate-800 object-cover shadow-lg" 
              alt="Avatar" 
            />
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cyan-500 transition-colors border-2 border-slate-900 shadow-md">
              <i className="fas fa-camera text-xs"></i>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>

          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Anzeigename</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">E-Mail Adresse</label>
                <input 
                  type="email" 
                  disabled
                  value={user?.email || 'user@example.com'}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-800">
              <button 
                onClick={logout}
                className="text-rose-500 hover:text-rose-400 font-bold transition-colors"
              >
                Ausloggen
              </button>
              
              <button 
                onClick={handleSave}
                className="bg-cyan-600 hover:bg-cyan-500 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2"
              >
                {isSaved ? (
                  <><i className="fas fa-check"></i> Gespeichert</>
                ) : (
                  'Einstellungen speichern'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-shield-alt text-cyan-500"></i>
          Deine Rollen
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold border border-slate-700">MEMBER</span>
          {user?.isAdmin && (
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-bold border border-cyan-500/20">ADMIN</span>
          )}
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20">BETA-TESTER</span>
        </div>
      </div>
    </div>
  );
};

export default AccountView;
