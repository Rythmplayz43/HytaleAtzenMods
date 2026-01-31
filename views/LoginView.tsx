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

  const BOOT_SEQUENCE = [
    "[    0.000000] ATZEN_OS Booting...",
    "[    0.412039] Loading grid_nodes...",
    "[    0.892012] Security layer: [HARDCORE_MODE]",
    "[    1.230911] Handshake with master_server: OK",
    "[    1.560210] Memory allocation complete.",
    "[    1.890001] System ready. Waiting for identity."
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
    }, 200);

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

  const quickLogin = () => {
    const mockUser = { uid: 'g_123', displayName: 'ATZE_GUEST', email: 'atze@atzen.de', isAdmin: false, nameColor: '#39FF14', nameEffect: 'none' };
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
    <div className="min-h-screen flex items-center justify-center p-6 hytale-bg relative overflow-hidden">
      <div className="w-full max-w-md bg-[#0A0A0A]/90 border-2 border-[#39FF14] p-10 relative z-10 toxic-shadow animate-in zoom-in duration-300">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black text-[#39FF14] leading-none tracking-tighter mb-2 glitch-text">
            HYTALE ATZEN
          </h1>
          <p className="text-[#4A4A4A] text-[9px] font-bold uppercase tracking-[0.5em] italic terminal-text">
            {isRegister ? 'IDENTITY_GEN_v2' : 'ACCESS_TERMINAL_v1'}
          </p>
        </div>

        <div className="space-y-8">
          <button 
            onClick={quickLogin}
            className="w-full h-14 bg-white hover:bg-[#39FF14] transition-all flex items-center justify-center font-black text-black border-4 border-black"
          >
            QUICK_ACCESS
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#333]"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#0A0A0A] px-4 text-[9px] font-black text-[#4A4A4A]">MANUAL_AUTH</span></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegister && (
              <div className="animate-in slide-in-from-left duration-300">
                <label className="text-[10px] font-black text-[#4A4A4A] uppercase mb-1 block">NAME</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full" required />
              </div>
            )}
            <div className="animate-in slide-in-from-left duration-500">
              <label className="text-[10px] font-black text-[#4A4A4A] uppercase mb-1 block">EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" required />
            </div>
            <div className="animate-in slide-in-from-left duration-700">
              <label className="text-[10px] font-black text-[#4A4A4A] uppercase mb-1 block">PASS</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" required />
            </div>

            <button className="w-full h-16 bg-[#39FF14] text-black font-black text-lg hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0">
              {isRegister ? 'EXECUTE_GEN' : 'START_SESSION'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-[#333]">
            <button onClick={() => setIsRegister(!isRegister)} className="text-[10px] font-bold text-[#4A4A4A] hover:text-[#39FF14] transition-colors uppercase">
              {isRegister ? '> BACK_TO_LOGIN' : '> CREATE_NEW_IDENTITY'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;