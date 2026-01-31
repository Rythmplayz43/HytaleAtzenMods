
import React, { useState, useEffect } from 'react';

interface LoginViewProps {
  onLogin: (user: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [booting, setBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [glitchTitle, setGlitchTitle] = useState(false);

  const LOGS = [
    "> CONNECTING TO ATZEN_NET...",
    "> BYPASSING HYTALE_SECURITY_PROTOCOL_v4...",
    "> DECRYPTING USER_RECORDS...",
    "> MOUNTING DATABASE /VOL/LOCAL_STORAGE",
    "> AUTH_SERVICE: [OK]",
    "> SYSTEM READY. STAND BY FOR ACCESS..."
  ];

  useEffect(() => {
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < LOGS.length) {
        setBootLogs(prev => [...prev, LOGS[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setBooting(false), 500);
      }
    }, 400);

    const glitchInterval = setInterval(() => {
      setGlitchTitle(true);
      setTimeout(() => setGlitchTitle(false), 150);
    }, 4000);

    return () => {
      clearInterval(logInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = { 
      uid: 'u_' + Math.random().toString(36).substr(2, 5), 
      displayName: name || email.split('@')[0], 
      email, 
      isAdmin: email.includes('admin'), 
      nameColor: '#39FF14',
      nameEffect: 'none' as const
    };
    localStorage.setItem('hytale_user', JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6 font-mono text-xs">
        <div className="w-full max-w-lg border border-[#333] p-10 bg-[#000]">
          <div className="space-y-2">
            {bootLogs.map((log, i) => (
              <div key={i} className="text-[#39FF14] animate-pulse">{log}</div>
            ))}
            <div className="w-2 h-4 bg-[#39FF14] animate-blink"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-6 relative overflow-hidden">
      <div className={`w-full max-w-md bg-[#161616] border-2 border-[#39FF14] p-10 shadow-[30px_30px_0px_0px_rgba(57,255,20,0.1)] relative z-10 animate-in fade-in zoom-in duration-500`}>
        
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-3 h-3 bg-[#333]"></div>
          <div className="w-3 h-3 bg-[#333]"></div>
          <div className="w-3 h-3 bg-[#39FF14] animate-pulse"></div>
        </div>

        <div className="mb-10">
          <h1 className={`text-5xl font-black text-[#39FF14] leading-none tracking-tighter mb-2 ${glitchTitle ? 'glitch-active' : ''}`}>
            HYTALE ATZEN
          </h1>
          <p className="text-[#7A7A7A] text-[9px] font-bold uppercase tracking-[0.4em] italic typewriter">
            {isRegister ? 'IDENTITY_GEN_MODULE' : 'ACCESS_TERMINAL_V.2.0'}
          </p>
        </div>

        <div className="space-y-8">
          <button 
            onClick={() => onLogin({ uid: 'g_123', displayName: 'ATZEN USER', email: 'user@gmail.com', isAdmin: false })}
            className="group w-full relative h-14 bg-white hover:bg-[#39FF14] transition-colors duration-300 flex items-center justify-center font-black text-black"
          >
            <span className="relative z-10">GOOGLE_SIGN_IN</span>
            <div className="absolute inset-0 border-4 border-black translate-x-1 translate-y-1 -z-0 group-active:translate-x-0 group-active:translate-y-0 transition-transform"></div>
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#333]"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#161616] px-4 text-[9px] font-black text-[#7A7A7A] uppercase tracking-widest">ENCRYPTED_AUTH</span></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegister && (
              <div className="animate-in slide-in-from-right duration-300">
                <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-1 block">DISPLAY_NAME</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-[#333] text-[#39FF14] p-4 text-sm font-bold focus:border-[#39FF14] outline-none"
                  required
                />
              </div>
            )}
            <div className="animate-in slide-in-from-right duration-500">
              <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-1 block">EMAIL_ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-[#333] text-[#39FF14] p-4 text-sm font-bold focus:border-[#39FF14] outline-none"
                required
              />
            </div>
            <div className="animate-in slide-in-from-right duration-700">
              <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-1 block">PASSPHRASE</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-[#333] text-[#39FF14] p-4 text-sm font-bold focus:border-[#39FF14] outline-none"
                required
              />
            </div>

            <button className="w-full h-16 bg-[#39FF14] text-black font-black text-lg hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0 toxic-shadow">
              {isRegister ? 'EXECUTE_REGISTRATION' : 'START_SESSION'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-[#333]">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-[10px] font-bold text-[#7A7A7A] hover:text-[#39FF14] transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <span className="w-1.5 h-1.5 bg-[#333] group-hover:bg-[#39FF14]"></span>
              {isRegister ? 'SWITCH_TO_LOGIN' : 'REGISTER_NEW_ENTITY'}
            </button>
          </div>
        </div>

        {/* Binary decor at bottom */}
        <div className="mt-8 flex justify-between items-center overflow-hidden h-4 text-[7px] text-[#333] font-mono whitespace-nowrap opacity-50 select-none">
          <span>01100001 01110100 01111010 01100101 01101110</span>
          <span>11011100 01100011 01011001 01100001</span>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
