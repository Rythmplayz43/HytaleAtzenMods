
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './views/MainDashboard';
import LoginView from './views/LoginView';

export const AuthContext = React.createContext<{
  user: any;
  logout: () => void;
}>({ user: null, logout: () => {} });

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('hytale_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('hytale_user');
    setUser(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
      <div className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent animate-spin"></div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, logout }}>
      <Router>
        {!user ? (
          <Routes>
            <Route path="*" element={<LoginView onLogin={(u) => setUser(u)} />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
