
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (user: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6">
      <div className="w-full max-w-md bg-[#161616] border-2 border-[#39FF14] p-10 shadow-[10px_10px_0px_0px_rgba(57,255,20,0.2)]">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#39FF14] mb-2 leading-none">HYTALE ATZEN</h1>
          <p className="text-[#7A7A7A] text-xs font-bold uppercase tracking-widest">{isRegister ? 'JOIN THE UNDERGROUND' : 'ACCESS GRANTED'}</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 font-black mb-8 hover:bg-[#39FF14] transition-colors"
        >
          GOOGLE LOGIN
        </button>

        <div className="relative mb-8 h-px bg-[#333]">
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#161616] px-4 text-[10px] font-black text-[#7A7A7A]">MANUAL</span>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {isRegister && (
            <div>
              <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-2 block tracking-widest">ATZEN NAME</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 text-white text-sm"
                required
              />
            </div>
          )}
          <div>
            <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-2 block tracking-widest">EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-white text-sm"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#7A7A7A] uppercase mb-2 block tracking-widest">PASSWORD</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-white text-sm"
              required
            />
          </div>
          <button className="w-full bg-[#39FF14] text-black py-4 font-black hover:bg-white transition-all">
            {isRegister ? 'REGISTER' : 'ENTER'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-[#333] text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-[10px] font-black text-[#7A7A7A] hover:text-[#39FF14] transition-colors"
          >
            {isRegister ? 'ALREADY A MEMBER? LOGIN' : 'NO ACCOUNT? CREATE ONE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
