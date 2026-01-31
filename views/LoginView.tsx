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
  const [intensity, setIntensity] = useState(0);

  const BOOT_SEQUENCE = [
    "[    0.000000] Initializing ATZEN_KERNEL v2.5.0-hardcore",
    "[    0.412039] Mounting internal storage /dev/sda1...",
    "[    0.892012] Loading security modules: [ENCRYPTION_ENABLED]",
    "[    1.230911] Connecting to Hytale Master Node...",
    "[    1.560210] Network handshake: SUCCESS",
    "[    1.890001] Starting authentication daemon...",
    "[    2.120485] Protocol: ATZEN_STATIC_ACCESS v1.0",
    "[    2.450123] System status: STABLE. Ready for input."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_SEQUENCE.length) {
        setBootLogs(prev => [...prev, BOOT_SEQUENCE[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 800);
      }
    }, 250);

    return () => clearInterval(interval);
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
      <div className="min-h-screen flex items-center justify-center bg-[#000] p-4 terminal-text text-[10px] sm:text-xs">
        <div className="w-full max-w-2xl border border-[#111] p-8 space-y-1">
          {bootLogs.map((log, i) => (
            <div key={i} className="text-[#39FF14] opacity-80">{log}</div>
          ))}
          <div className="w-2 h-4 bg-[#39FF14] animate-pulse inline-block align-middle ml-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-transparent">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none overflow-hidden">
        <div className="text-[30vw] font-black tracking-tighter text-white leading-none rotate-[-10deg]">ATZEN</div>
      </div>

      <div className="w-full max-w-md bg-[#111] border-2 border-[#39FF14] p-10 relative z-10 toxic-shadow animate-in zoom-in fade-in duration-300">
        {/* Terminal corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#39FF14]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#39FF14]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#39FF14]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#39FF14]"></div>

        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black text-[#39FF14] leading-none tracking-tighter mb-2 glitch-on-hover cursor-default">
            HYTALE ATZEN
          </h1>
          <p className="text-[#4A4A4A] text-[9px] font-bold uppercase tracking-[0.5em] italic">
            {isRegister ? 'IDENTITY_CREATION_SEQUENCE' : 'USER_IDENTIFICATION_TERMINAL'}
          </p>
        </div>

        <div className="space-y-8">
          <button 
            onClick={() => onLogin({ uid: 'g_123', displayName: 'ATZEN USER', email: 'user@gmail.com', isAdmin: false })}
            className="w-full h-14 bg-white hover:bg-[#39FF14] transition-all flex items-center justify-center font-black text-black border-4 border-black hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0"
          >
            GOOGLE_SIGN_IN
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#333]"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#111] px-4 text-[9px] font-black text-[#4A4A4A]">MANUAL_AUTH</span></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegister && (
              <div className="animate-in slide-in-from-left duration-300">
                <label className="text-[10px] font-black text-[#4A4A4A] uppercase mb-1 block">DISPLAY_NAME</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            )}
            <div className="animate-in slide-in-from-left duration-500">
              <label className="text-[10px] font-black text-[#4A4A4A] uppercase mb-1 block">EMAIL_IDENTIFIER</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="animate-in slide-in-from-left duration-700">
              <label className="text-[10px] font-black text-[#4A4A4A] uppercase mb-1 block">SECURE_PASSPHRASE</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <button className="w-full h-16 bg-[#39FF14] text-black font-black text-lg hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[10px_10px_0px_0px_rgba(57,255,20,0.2)]">
              {isRegister ? 'EXECUTE_REGISTRATION' : 'START_SESSION'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-[#333]">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-[10px] font-bold text-[#4A4A4A] hover:text-[#39FF14] transition-colors uppercase tracking-widest"
            >
              {isRegister ? '> ALREADY_AN_ATZE?_LOGIN' : '> JOIN_THE_CREW_REGISTER'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-[7px] text-[#222] font-mono text-center select-none uppercase">
          SECURED BY ATZEN_SHIELD_PROTOCOL_v4 // NO DATA LEAKS // PURE ACCESS
        </div>
      </div>
    </div>
  );
};

export default LoginView;