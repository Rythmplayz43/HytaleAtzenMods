
import React, { useState, useEffect } from 'react';

interface LoginViewProps {
  onLogin: (user: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = { 
      uid: 'u_' + Math.random().toString(36).substr(2, 5), 
      displayName: name || email.split('@')[0], 
      email, 
      isAdmin: email.includes('admin'), 
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` 
    };
    localStorage.setItem('hytale_user', JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  const handleGoogleLogin = () => {
    const mockUser = { uid: 'g_123', displayName: 'ATZEN USER', email: 'user@gmail.com', isAdmin: false, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google' };
    localStorage.setItem('hytale_user', JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6 relative overflow-hidden">
      {/* Visual Overlays */}
      <div className="noise-bg"></div>
      <div className="scanlines"></div>
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10 pointer-events-none select-none">
        <h1 className="text-[20vw] font-black tracking-tighter text-white/5 whitespace-nowrap">HYTALE ATZEN</h1>
      </div>

      <div className={`w-full max-w-md bg-[#161616] border-2 border-[#39FF14] p-10 shadow-[20px_20px_0px_0px_rgba(57,255,20,0.2)] relative z-10 transition-all duration-700 transform ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
        
        {/* Terminal Header Decor */}
        <div className="absolute top-0 left-0 w-full flex justify-between px-4 py-1 border-b border-[#333] bg-black text-[8px] font-mono text-[#7A7A7A]">
          <span>STATUS: WAITING_FOR_AUTH</span>
          <span>SECURE_NODE_04</span>
        </div>

        <div className="mt-4 mb-10 overflow-hidden">
          <h1 className="text-4xl font-black text-[#39FF14] mb-2 leading-none tracking-tighter glitch-text cursor-default">
            HYTALE ATZEN
          </h1>
          <div className="h-0.5 bg-[#39FF14] w-full origin-left transition-all duration-1000" style={{ transform: showContent ? 'scaleX(1)' : 'scaleX(0)' }}></div>
          <p className="text-[#7A7A7A] text-[10px] font-bold uppercase tracking-widest mt-2 flicker">
            {isRegister ? ':: INITIALIZING_NEW_ENTITY' : ':: ACCESS_PROTOCOL_LOADED'}
          </p>
        </div>

        <div className={`space-y-8 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <button 
            onClick={handleGoogleLogin}
            className="group w-full flex items-center justify-center gap-3 bg-white text-black py-4 font-black hover:bg-[#39FF14] transition-all relative overflow-hidden"
          >
            <span className="relative z-10">GOOGLE LOGIN</span>
            <div className="absolute inset-0 bg-[#39FF14] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <div className="relative h-px bg-[#333]">
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#161616] px-4 text-[10px] font-black text-[#7A7A7A]">OR_USE_MANUAL</span>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegister && (
              <div className="animate-in slide-in-from-left duration-300">
                <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-2 block tracking-widest">ATZEN_NAME</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 text-white text-sm border border-[#333] focus:border-[#39FF14] transition-colors"
                  required
                />
              </div>
            )}
            <div className="animate-in slide-in-from-left duration-500">
              <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-2 block tracking-widest">EMAIL_ADDRESS</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 text-white text-sm border border-[#333] focus:border-[#39FF14] transition-colors"
                required
              />
            </div>
            <div className="animate-in slide-in-from-left duration-700">
              <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-2 block tracking-widest">PASSWORD_KEY</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-white text-sm border border-[#333] focus:border-[#39FF14] transition-colors"
                required
              />
            </div>
            <button className="w-full bg-[#39FF14] text-black py-4 font-black hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent hover:border-black">
              {isRegister ? 'GENERATE_IDENTITY' : 'INITIATE_LOGIN'}
            </button>
          </form>

          <div className="pt-6 border-t border-[#333] text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-[10px] font-black text-[#7A7A7A] hover:text-[#39FF14] transition-colors uppercase tracking-tighter"
            >
              {isRegister ? '> BACK_TO_LOGIN' : '> CREATE_NEW_RECORD'}
            </button>
          </div>
        </div>

        {/* Footer Decor */}
        <div className="mt-10 flex justify-between items-center opacity-20 grayscale">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-[#39FF14] animate-pulse"></div>
            <div className="w-2 h-2 bg-[#39FF14] animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-[#39FF14] animate-pulse delay-150"></div>
          </div>
          <span className="text-[8px] font-mono">ENCRYPTED_VTX_2048</span>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
