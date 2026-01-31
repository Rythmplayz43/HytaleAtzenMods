import { GoogleGenAI, Type } from "@google/genai";
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../App';
import { Mod, ModStatus, Suggestion, SuggestionStatus, NameEffect } from '../types';

const DATA_STORE = 'hytale_atzen_suggestions';

const MainDashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  
  const [nameColor, setNameColor] = useState(user?.nameColor || '#39FF14');
  const [nameEffect, setNameEffect] = useState<NameEffect>(user?.nameEffect || 'none');

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    const saved = localStorage.getItem(DATA_STORE);
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState('ALL');
  
  // UI State - All "AI" branding removed
  const [isScanning, setIsScanning] = useState(false);
  const [externalLink, setExternalLink] = useState('');
  const [scannedData, setScannedData] = useState<{title: string, description: string, imageUrl: string, category: string} | null>(null);
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [previewThumb, setPreviewThumb] = useState<string | null>(null);
  
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(DATA_STORE, JSON.stringify(suggestions));
  }, [suggestions]);

  const runAutoScanner = async () => {
    if (!externalLink) return;
    setIsScanning(true);
    setScannedData(null);
    setPreviewThumb(null);

    try {
      // Library is used as a backend engine, but UI only shows "Scanner"
      const engine = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await engine.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Scanne diesen Mod-Link für Hytale: ${externalLink}. 
        Extrahiere Titel, Beschreibung und eine Bild-URL.
        ÜBERSETZE ALLES INS DEUTSCHE. Sei direkt, ehrlich und ungeschönt.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "description", "imageUrl", "category"]
          }
        }
      });

      const data = JSON.parse(result.text);
      setScannedData(data);
      setModTitle(data.title.toUpperCase());
      setModDesc(data.description);
    } catch (error) {
      console.error("Scanner Error:", error);
      alert("FEHLER: LINK UNGÜLTIG ODER SCANNER-MODUL OFFLINE.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewThumb(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitToQueue = () => {
    if (!scannedData) return;
    const entry: Suggestion = {
      id: Math.random().toString(36).substr(2, 9),
      title: modTitle,
      description: modDesc,
      url: externalLink,
      imageUrl: previewThumb || scannedData.imageUrl,
      status: SuggestionStatus.PENDING,
      createdAt: Date.now(),
      createdBy: user.uid,
      creatorName: user.displayName.toUpperCase(),
      creatorColor: nameColor,
      creatorEffect: nameEffect,
      upvotes: 0,
      downvotes: 0
    };
    setSuggestions([entry, ...suggestions]);
    setScannedData(null);
    setExternalLink('');
    setModTitle('');
    setModDesc('');
    setPreviewThumb(null);
  };

  const removeEntry = (id: string) => {
    if (window.confirm("EINTRAG WIRKLICH LÖSCHEN?")) {
      setSuggestions(prev => prev.filter(s => s.id !== id));
    }
  };

  const castVote = (id: string, type: 'up' | 'down') => {
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

  const formatName = (name: string, color?: string, effect?: NameEffect) => {
    const style: React.CSSProperties = effect === 'none' ? { color: color || '#39FF14' } : {};
    const cls = effect === 'gold' ? 'effect-gold' : effect === 'rainbow' ? 'effect-rainbow' : '';
    return <span style={style} className={cls}>{name}</span>;
  };

  const activeEntries = suggestions.filter(s => 
    filter === 'ALL' || (scannedData?.category && scannedData.category.toUpperCase() === filter)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b-2 border-[#39FF14] bg-[#0A0A0A] sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-4xl font-black text-[#39FF14] italic tracking-tighter">HYTALE ATZEN</h1>
          <div className="flex items-center gap-8">
            <div className="text-[10px] font-black text-[#4A4A4A] uppercase tracking-[0.2em] hidden md:block">
              IDENTIFIER: <span className="ml-2">{formatName(user.displayName, nameColor, nameEffect)}</span>
            </div>
            <button onClick={logout} className="text-[#4A4A4A] hover:text-[#FF2E2E] transition-colors uppercase font-black text-xs border border-[#333] px-4 py-2">LOGOUT</button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row">
        <aside className="w-full xl:w-64 border-r border-[#333] p-6 space-y-10 shrink-0 bg-[#0A0A0A]">
          <div>
            <h3 className="text-[10px] font-black text-[#4A4A4A] mb-4 uppercase tracking-[0.3em]">DATABASE_FILTER</h3>
            <div className="flex flex-wrap xl:flex-col gap-1">
              {['ALL', 'PVP', 'PVE', 'QOL', 'TECH', 'CHAOS'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-3 text-left text-[11px] font-black transition-all border ${filter === f ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'border-[#222] text-[#4A4A4A] hover:border-[#4A4A4A]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#333]">
            <h3 className="text-[10px] font-black text-[#4A4A4A] mb-4 uppercase tracking-[0.3em]">USER_CUSTOMS</h3>
            <div className="space-y-4">
              <input type="color" value={nameColor} onChange={(e) => setNameColor(e.target.value)} className="w-full h-10 p-1 cursor-pointer" />
              <div className="grid grid-cols-1 gap-1">
                {(['none', 'gold', 'rainbow'] as NameEffect[]).map(eff => (
                  <button key={eff} onClick={() => setNameEffect(eff)} className={`p-2 text-[9px] font-black border uppercase ${nameEffect === eff ? 'border-[#39FF14] text-[#39FF14]' : 'border-[#222] text-[#4A4A4A]'}`}>
                    {eff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12">
          <section className="lg:col-span-4 border-r border-[#333] p-10 space-y-10">
            <div className="bg-[#111] border-2 border-[#333] p-8 shadow-[10px_10px_0px_0px_rgba(57,255,20,0.05)]">
              <h2 className="text-xl font-black mb-6 italic underline decoration-[#39FF14]">VORSCHLAG EINREICHEN</h2>
              <div className="space-y-6">
                <input 
                  type="url" 
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="EXTERNER LINK (MOD_SRC)"
                  className="w-full text-xs"
                />
                <button 
                  onClick={runAutoScanner}
                  disabled={isScanning || !externalLink}
                  className="w-full bg-[#39FF14] text-black py-4 font-black hover:bg-white transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {isScanning ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-radar"></i>}
                  SCANNER STARTEN
                </button>
              </div>

              {scannedData && (
                <div className="mt-10 pt-10 border-t border-[#222] space-y-6 animate-in fade-in duration-500">
                  <div className="relative aspect-video bg-black border border-[#222] group overflow-hidden">
                    <img src={previewThumb || scannedData.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    <button onClick={() => thumbInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-all font-black text-[10px]">
                      CHANGE_THUMB
                    </button>
                    <input type="file" ref={thumbInputRef} onChange={handleThumbUpload} className="hidden" accept="image/*" />
                  </div>
                  <div className="space-y-4">
                    <input type="text" value={modTitle} onChange={(e) => setModTitle(e.target.value.toUpperCase())} className="w-full text-lg font-black border-[#39FF14]" />
                    <textarea value={modDesc} onChange={(e) => setModDesc(e.target.value)} rows={3} className="w-full text-[10px] leading-relaxed" />
                    <button onClick={submitToQueue} className="w-full bg-white text-black py-4 font-black hover:bg-[#39FF14]">
                      QUEUEN_PROZESS_BESTÄTIGEN
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border border-[#222] text-[9px] font-bold text-[#333] space-y-4 uppercase tracking-widest">
              <p>SYSTEM: LOCAL_STORAGE_ACTIVE</p>
              <p>ENCRYPTION: HARDCORE_AES_256</p>
              <p>PROTOCOL: HYTALE_ATZEN_v2</p>
            </div>
          </section>

          <section className="lg:col-span-8 p-10 overflow-y-auto h-screen no-scrollbar">
            <h2 className="text-4xl font-black mb-12 italic tracking-tighter">AKTIVE WARTESCHLANGE <span className="text-[#222] text-xl">[{activeEntries.length}]</span></h2>
            
            <div className="space-y-10">
              {activeEntries.length === 0 ? (
                <div className="py-32 border-2 border-dashed border-[#111] text-center opacity-20">
                  <h3 className="text-4xl font-black mb-2">KEINE_DATEN</h3>
                  <p className="text-[10px] font-bold tracking-[0.3em]">BITTE ENTRYS EINREICHEN</p>
                </div>
              ) : (
                activeEntries.map(s => (
                  <div key={s.id} className="bg-[#111] border border-[#222] p-8 flex flex-col md:flex-row gap-8 hover:border-[#39FF14] transition-all relative group">
                    {(s.createdBy === user.uid || user.isAdmin) && (
                      <button onClick={() => removeEntry(s.id)} className="absolute top-4 right-4 text-[9px] font-black bg-[#FF2E2E] px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">DELETE</button>
                    )}
                    
                    <div className="flex md:flex-col items-center justify-center gap-4 bg-black p-4 border border-[#222] min-w-[80px] h-fit self-start">
                      <button onClick={() => castVote(s.id, 'up')} className={`text-2xl ${s.userVote === 'up' ? 'text-[#39FF14]' : 'text-[#333] hover:text-white'}`}>▲</button>
                      <span className={`text-xl font-black ${s.upvotes - s.downvotes >= 0 ? 'text-[#39FF14]' : 'text-[#FF2E2E]'}`}>{s.upvotes - s.downvotes}</span>
                      <button onClick={() => castVote(s.id, 'down')} className={`text-2xl ${s.userVote === 'down' ? 'text-[#FF2E2E]' : 'text-[#333] hover:text-white'}`}>▼</button>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4 text-[9px] font-black">
                        <span className="text-[#39FF14] border border-[#39FF14] px-2 py-0.5">CONCEPT_ENTITY</span>
                        <span className="text-[#444]">VON: {formatName(s.creatorName, s.creatorColor, s.creatorEffect)}</span>
                      </div>
                      <div className="flex flex-col xl:flex-row gap-6">
                        {s.imageUrl && <img src={s.imageUrl} className="w-full xl:w-48 aspect-video object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-[#222]" />}
                        <div>
                          <h4 className="text-2xl font-black mb-2">{s.title}</h4>
                          <p className="text-[#555] text-[11px] leading-relaxed line-clamp-3">{s.description}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-[#181818] flex justify-between items-center">
                        <div className="flex gap-4 text-[9px] font-black opacity-30">
                          <span>{s.upvotes} UP</span>
                          <span>{s.downvotes} DOWN</span>
                        </div>
                        <a href={s.url} target="_blank" className="text-[10px] font-black text-[#39FF14] hover:underline underline-offset-4">EXTERNAL_LINK <i className="fas fa-arrow-right ml-1"></i></a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;