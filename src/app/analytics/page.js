'use client';
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 transform z-50">
        <p className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-1.5">
          <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{payload[0].value}</p>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Done</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function Analytics() {
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch('/api/habits').then(r => r.json()), fetch('/api/checkin').then(r => r.json())])
      .then(([hData, cData]) => { setHabits(hData); setCheckIns(cData); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen bg-[#F3F5F8] dark:bg-[#0F172A] flex items-center justify-center"><div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;

  const totalHabits = habits.length;
  const totalCompleted = checkIns.filter(c => c.completed).length;

  const chartData = Array.from({ length: 7 }).map((_, index) => {
    const d = subDays(new Date(), 6 - index);
    return { name: format(d, 'EEE'), completed: checkIns.filter(c => c.date === format(d, 'yyyy-MM-dd') && c.completed).length };
  });

  return (
    <div className="min-h-screen relative font-sans selection:bg-indigo-100 pb-20 sm:pb-24 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <main className="max-w-xl mx-auto px-4 sm:px-5 pt-6 sm:pt-12 relative z-10">
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <button onClick={() => router.back()} className="w-9 h-9 sm:w-12 sm:h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all mb-4 sm:mb-8">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-1 sm:mb-3 flex items-center gap-2 sm:gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Analytics</span> 
            <span className="text-3xl sm:text-4xl drop-shadow-md">📈</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg">Tracking your journey to success.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 mb-6 sm:mb-10">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-4 sm:p-7 rounded-[1.25rem] sm:rounded-[2rem] shadow-sm border border-white/60 dark:border-slate-700/50 animate-fade-in-up">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-5">
              <span className="text-xl sm:text-2xl drop-shadow-sm">🎯</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5">Total Habits</p>
            <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">{totalHabits}</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-4 sm:p-7 rounded-[1.25rem] sm:rounded-[2rem] shadow-sm border border-white/60 dark:border-slate-700/50 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-50 dark:bg-green-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-5">
              <span className="text-xl sm:text-2xl drop-shadow-sm">🔥</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5">Completed</p>
            <p className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">{totalCompleted}</p>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-white/60 dark:border-slate-700/50 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-white">Past 7 Days</h3>
            <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] sm:text-xs font-bold rounded-lg sm:rounded-xl uppercase tracking-wider">Activity</span>
          </div>
          
          <div className="h-[200px] sm:h-[300px] w-full mt-2 sm:mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={1} /><stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} /></linearGradient>
                  <linearGradient id="colorEmpty" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e2e8f0" stopOpacity={0.6} /><stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.2} /></linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)', rx: 12 }} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                <Bar dataKey="completed" radius={[6, 6, 6, 6]} maxBarSize={36}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.completed > 0 ? 'url(#colorUv)' : 'url(#colorEmpty)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}