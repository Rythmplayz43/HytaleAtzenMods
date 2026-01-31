
import { GoogleGenAI, Type } from "@google/genai";
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../App';
import { Mod, ModStatus, Suggestion, SuggestionStatus, NameEffect } from '../types';

const STORAGE_KEY = 'hytale_atzen_suggestions';

const MainDashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  
  // User Profile Settings State (Local to session)
  const [userNameColor, setUserNameColor] = useState(user?.nameColor || '#39FF14');
  const [userNameEffect, setUserNameEffect] = useState<NameEffect>(user?.nameEffect || 'none');

  // Persistence: Load from LocalStorage
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Filters
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  // UI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [modLink, setModLink] = useState('');
  const [aiResult, setAiResult] = useState<{title: string, description: string, imageUrl: string, category: string} | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence: Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
  }, [suggestions]);

  const analyzeModWithAI = async () => {
    if (!modLink) return;
    setIsAiLoading(true);
    setAiResult(null);
    setCustomThumbnail(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analysiere diesen Mod-Link für Hytale: ${modLink}. 
        Extrahiere Titel, Beschreibung und eine Bild-URL.
        ÜBERSETZE ALLES INS DEUTSCHE. Sei direkt, ehrlich und ungeschönt.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Name der Mod auf Deutsch" },
              description: { type: Type.STRING, description: "Ehrliche Beschreibung auf Deutsch" },
              imageUrl: { type: Type.STRING, description: "Bild-URL" },
              category: { type: Type.STRING, description: "Kategorie (PVP, PVE, QOL, TECH, CHAOS)" }
            },
            required: ["title", "description", "imageUrl", "category"]
          }
        }
      });

      const data = JSON.parse(response.text);
      setAiResult(data);
      setEditedTitle(data.title.toUpperCase());
      setEditedDesc(data.description);
    } catch (error) {
      console.error("AI Error:", error);
      alert("FEHLER: LINK IST SCHROTT ODER KI HAT KEINEN BOCK.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmSuggestion = () => {
    if (!aiResult) return;
    const newSug: Suggestion = {
      id: Math.random().toString(36).substr(2, 9),
      title: editedTitle,
      description: editedDesc,
      url: modLink,
      imageUrl: customThumbnail || aiResult.imageUrl,
      status: SuggestionStatus.PENDING,
      createdAt: Date.now(),
      createdBy: user.uid,
      creatorName: user.displayName.toUpperCase(),
      creatorColor: userNameColor,
      creatorEffect: userNameEffect,
      upvotes: 0,
      downvotes: 0
    };
    setSuggestions([newSug, ...suggestions]);
    setAiResult(null);
    setModLink('');
    setEditedTitle('');
    setEditedDesc('');
    setCustomThumbnail(null);
  };

  const deleteSuggestion = (id: string) => {
    if (window.confirm("VORSCHLAG WIRKLICH LÖSCHEN?")) {
      setSuggestions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleVote = (id: string, type: 'up' | 'down') => {
    setSuggestions(prev => prev.map(s => {
      if (s.id !== id) return s;
      let up = s.upvotes;
      let down = s.downvotes;
      if (s.userVote === type) {
        if (type === 'up') up--; else down--;
        return { ...s, upvotes: up, downvotes: down, userVote: undefined };
      } else {
        if (s.userVote === 'up') up--;
        if (s.userVote === 'down') down--;
        if (type === 'up') up++; else down++;
        return { ...s, upvotes: up, downvotes: down, userVote: type };
      }
    }));
  };

  const renderName = (name: string, color?: string, effect?: NameEffect) => {
    const style: React.CSSProperties = effect === 'none' ? { color: color || '#39FF14' } : {};
    const className = effect === 'gold' ? 'effect-gold' : effect === 'rainbow' ? 'effect-rainbow' : '';
    return <span style={style} className={className}>{name}</span>;
  };

  const filteredSuggestions = suggestions.filter(s => 
    activeFilter === 'ALL' || (aiResult?.category && aiResult.category.toUpperCase() === activeFilter)
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* HEADER */}
      <header className="border-b-2 border-[#39FF14] bg-[#0A0A0A] sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-4xl font-black text-[#39FF14] leading-none tracking-tighter italic">HYTALE ATZEN</h1>
          <div className="flex items-center gap-10">
            <div className="text-[10px] font-black text-[#7A7A7A] uppercase tracking-[0.2em] hidden md:block">
              ATZEN-ID: <span className="ml-2">{renderName(user.displayName, userNameColor, userNameEffect)}</span>
            </div>
            <button onClick={logout} className="text-[#7A7A7A] hover:text-[#FF2E2E] transition-colors uppercase font-black text-xs border border-[#333] px-4 py-2 hover:border-[#FF2E2E]">LOGOUT</button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* SIDEBAR */}
        <aside className="w-full xl:w-64 border-r border-[#333] bg-[#0A0A0A] p-6 space-y-10 shrink-0">
          <div>
            <h3 className="text-[10px] font-black text-[#7A7A7A] mb-4 uppercase tracking-[0.2em]">FILTER</h3>
            <div className="flex flex-wrap xl:flex-col gap-2">
              {['ALL', 'PVP', 'PVE', 'QOL', 'TECH', 'CHAOS'].map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-3 text-left text-xs font-black transition-all border ${activeFilter === f ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'border-[#333] text-[#7A7A7A] hover:border-[#7A7A7A]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#333]">
            <h3 className="text-[10px] font-black text-[#7A7A7A] mb-4 uppercase tracking-[0.2em]">DEIN STYLE</h3>
            <div className="space-y-4">
              <input 
                type="color" 
                value={userNameColor}
                onChange={(e) => setUserNameColor(e.target.value)}
                className="w-full h-10 p-1 cursor-pointer"
              />
              <div className="grid grid-cols-1 gap-1">
                {(['none', 'gold', 'rainbow'] as NameEffect[]).map(eff => (
                  <button 
                    key={eff}
                    onClick={() => setUserNameEffect(eff)}
                    className={`p-2 text-[10px] font-black border uppercase transition-all ${userNameEffect === eff ? 'border-[#39FF14] text-[#39FF14]' : 'border-[#333] text-[#7A7A7A]'}`}
                  >
                    {eff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT: SUBMIT MOD */}
          <section className="lg:col-span-4 border-r border-[#333] p-10 space-y-10">
            <div className="bg-[#161616] border-2 border-[#333] p-10 toxic-shadow">
              <h2 className="text-2xl font-black mb-6 leading-none">DROP DEINEN SCHROTT</h2>
              <div className="space-y-6">
                <input 
                  type="url" 
                  value={modLink}
                  onChange={(e) => setModLink(e.target.value)}
                  placeholder="MOD LINK (CURSEFORGE / GITHUB)"
                  className="w-full font-bold placeholder:text-[#333]"
                />
                <button 
                  onClick={analyzeModWithAI}
                  disabled={isAiLoading || !modLink}
                  className="w-full bg-[#39FF14] text-black py-4 font-black hover:bg-white transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                >
                  {isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-terminal"></i>}
                  DATEN SCRAPEN
                </button>
              </div>

              {aiResult && (
                <div className="mt-12 pt-12 border-t border-[#333] space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="relative group/thumb aspect-video bg-black border border-[#333] overflow-hidden">
                    <img 
                      src={customThumbnail || aiResult.imageUrl || 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=400'} 
                      alt="Preview" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-black px-4 py-2 text-[10px] font-black hover:bg-[#39FF14]"
                      >
                          CUSTOM THUMBNAIL
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-2 block tracking-widest">NAME</label>
                      <input 
                        type="text" 
                        value={editedTitle} 
                        onChange={(e) => setEditedTitle(e.target.value.toUpperCase())}
                        className="w-full border-2 border-[#39FF14] font-black text-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-2 block tracking-widest">EHRRETTUNG (DESC)</label>
                      <textarea 
                        rows={4}
                        value={editedDesc} 
                        onChange={(e) => setEditedDesc(e.target.value)}
                        className="w-full text-xs leading-relaxed"
                      />
                    </div>
                    <button 
                      onClick={confirmSuggestion}
                      className="w-full bg-white text-black py-4 font-black hover:bg-[#39FF14] transition-all"
                    >
                      AB IN DIE QUEUE
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border border-[#333] bg-black">
              <h3 className="text-xs font-black text-[#39FF14] mb-4 tracking-widest italic underline decoration-2 underline-offset-4">ATZEN PROTOKOLL</h3>
              <ul className="text-[10px] space-y-4 font-bold text-[#555]">
                <li className="flex gap-4"><span className="text-[#39FF14]">01</span> KEIN SOFT-KRAM.</li>
                <li className="flex gap-4"><span className="text-[#39FF14]">02</span> DIE ATZEN ENTSCHEIDEN.</li>
                <li className="flex gap-4"><span className="text-[#39FF14]">03</span> KEINE VOTES = KEINE MOD.</li>
                <li className="flex gap-4"><span className="text-[#39FF14]">04</span> DIESE APP SPEICHERT LOKAL.</li>
              </ul>
            </div>
          </section>

          {/* RIGHT: MOD FEED */}
          <section className="lg:col-span-8 p-10 space-y-16 overflow-y-auto no-scrollbar max-h-screen">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-black italic tracking-tighter">MOD QUEUE <span className="text-[#333] text-lg not-italic">({filteredSuggestions.length})</span></h2>
              <div className="flex gap-4">
                <span className="text-[10px] font-black text-[#7A7A7A]">SORT: TRENDING</span>
              </div>
            </div>

            <div className="space-y-12">
              {filteredSuggestions.length === 0 ? (
                <div className="py-40 border-2 border-dashed border-[#161616] text-center opacity-30">
                   <h3 className="text-5xl font-black mb-4">LEERE</h3>
                   <p className="text-xs font-bold uppercase tracking-[0.5em]">NIEMAND HAT EIER. SCHREIB WAS REIN.</p>
                </div>
              ) : (
                filteredSuggestions.map(s => (
                  <div key={s.id} className="bg-[#161616] border border-[#333] p-10 flex flex-col lg:flex-row gap-10 hover:border-[#39FF14] transition-colors relative group">
                    
                    {/* OWNER ACTIONS */}
                    {(s.createdBy === user.uid || user.isAdmin) && (
                        <button 
                            onClick={() => deleteSuggestion(s.id)}
                            className="absolute top-4 right-4 text-[10px] font-black bg-[#FF2E2E] text-white px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            DELETE
                        </button>
                    )}

                    {/* VOTE WIDGET */}
                    <div className="flex lg:flex-col items-center justify-center gap-6 bg-black p-6 border border-[#333] h-fit self-start lg:min-w-[100px]">
                      <button 
                        onClick={() => handleVote(s.id, 'up')}
                        className={`text-3xl transition-all active:scale-150 leading-none ${s.userVote === 'up' ? 'text-[#39FF14]' : 'text-[#333] hover:text-[#7A7A7A]'}`}
                      >
                        ▲
                      </button>
                      <span className={`text-2xl font-black tracking-tighter leading-none ${s.upvotes - s.downvotes > 0 ? 'text-[#39FF14]' : s.upvotes - s.downvotes < 0 ? 'text-[#FF2E2E]' : 'text-white'}`}>
                        {s.upvotes - s.downvotes}
                      </span>
                      <button 
                        onClick={() => handleVote(s.id, 'down')}
                        className={`text-3xl transition-all active:scale-150 leading-none ${s.userVote === 'down' ? 'text-[#FF2E2E]' : 'text-[#333] hover:text-[#7A7A7A]'}`}
                      >
                        ▼
                      </button>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="status-badge border-[#39FF14] text-[#39FF14]">STATUS: CONCEPT</span>
                        <span className="text-[10px] font-black text-[#555]">VON: {renderName(s.creatorName, s.creatorColor, s.creatorEffect)}</span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8">
                        {s.imageUrl && (
                          <div className="w-full md:w-64 aspect-video bg-black border border-[#333] shrink-0 overflow-hidden">
                            <img 
                              src={s.imageUrl} 
                              alt={s.title} 
                              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-3xl font-black leading-none mb-4 group-hover:text-[#39FF14] transition-colors">{s.title}</h4>
                          <p className="text-[#7A7A7A] text-xs leading-relaxed line-clamp-4">{s.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-[#333]">
                        <div className="flex gap-6">
                          <span className="text-[10px] font-bold text-[#39FF14] uppercase"><i className="fas fa-arrow-up mr-2"></i>{s.upvotes} UP</span>
                          <span className="text-[10px] font-bold text-[#FF2E2E] uppercase"><i className="fas fa-arrow-down mr-2"></i>{s.downvotes} DOWN</span>
                        </div>
                        <a href={s.url} target="_blank" className="text-[10px] font-black text-[#39FF14] border-b border-transparent hover:border-[#39FF14] pb-1">QUELLE <i className="fas fa-external-link-alt ml-1"></i></a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t-2 border-[#333] py-8 px-6 bg-[#000]">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 hover:opacity-100 transition-opacity duration-500">
           <div className="text-[10px] font-black tracking-[0.5em] text-[#7A7A7A]">HYTALE ATZEN &copy; 2025 // NO MERCY</div>
           <div className="flex gap-10">
              <span className="text-[10px] font-black text-[#39FF14]">HANDCRAFTED BY ATZEN</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default MainDashboard;
