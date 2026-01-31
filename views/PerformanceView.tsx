
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ServerSnapshot } from '../types';

// Mock performance data for the last 60 minutes
const generateMockData = (): ServerSnapshot[] => {
  const data: ServerSnapshot[] = [];
  const now = Date.now();
  for (let i = 60; i >= 0; i--) {
    data.push({
      timestamp: now - (i * 60000),
      playersOnline: Math.floor(Math.random() * 20) + 5,
      tpsAvg60: 18 + Math.random() * 2,
      jvmUsedMem: 4000 + Math.random() * 2000,
      jvmMaxMem: 16384,
      chunksActive: 1200 + Math.random() * 200,
      entitiesActive: 450 + Math.random() * 100,
      sourceOk: true,
      createdAt: now - (i * 60000)
    });
  }
  return data;
};

const PerformanceView: React.FC = () => {
  const [history, setHistory] = useState<ServerSnapshot[]>(generateMockData());
  const current = history[history.length - 1];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time update
      setHistory(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          ...current,
          timestamp: Date.now(),
          createdAt: Date.now(),
          playersOnline: Math.max(0, current.playersOnline + (Math.random() > 0.5 ? 1 : -1)),
          tpsAvg60: Math.min(20, Math.max(15, current.tpsAvg60 + (Math.random() - 0.5)))
        });
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const formatTime = (time: number) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-white">Server Performance</h1>
        <p className="text-slate-400">Live-Metriken des Hytale Gameservers (Updates alle 60 Sek).</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Spieler Online" value={current.playersOnline} icon="fa-users" color="text-cyan-400" />
        <StatCard label="TPS (Avg 1m)" value={current.tpsAvg60.toFixed(2)} icon="fa-bolt" color={current.tpsAvg60 > 18 ? 'text-emerald-400' : 'text-amber-400'} />
        <StatCard label="RAM Nutzung" value={`${(current.jvmUsedMem / 1024).toFixed(1)} GB`} icon="fa-memory" color="text-purple-400" />
        <StatCard label="Entities" value={current.entitiesActive} icon="fa-ghost" color="text-rose-400" />
      </div>

      {/* Main Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <i className="fas fa-wave-square text-cyan-500"></i>
          TPS Verlauf (letzte 60 Min)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime} 
                stroke="#64748b" 
                fontSize={12} 
                minTickGap={30}
              />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} />
              <Tooltip 
                labelFormatter={formatTime}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="tpsAvg60" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorTps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Spieleranzahl</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#64748b" fontSize={10} minTickGap={30} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip labelFormatter={formatTime} />
                <Line type="stepAfter" dataKey="playersOnline" stroke="#f43f5e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chunks Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Chunks & Entities</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#64748b" fontSize={10} minTickGap={30} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip labelFormatter={formatTime} />
                <Line type="monotone" dataKey="chunksActive" stroke="#3b82f6" strokeWidth={2} dot={false} name="Chunks" />
                <Line type="monotone" dataKey="entitiesActive" stroke="#a855f7" strokeWidth={2} dot={false} name="Entities" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string | number, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl ${color}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default PerformanceView;
