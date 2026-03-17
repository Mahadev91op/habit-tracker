'use client';
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200/60 dark:border-slate-700/60 transform scale-100 animate-fade-in-up z-50">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            {payload[0].value}
          </p>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Done</span>
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
    Promise.all([
      fetch('/api/habits').then(r => r.json()),
      fetch('/api/checkin').then(r => r.json())
    ]).then(([habitsData, checkInsData]) => {
      setHabits(habitsData);
      setCheckIns(checkInsData);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F3F5F8] dark:bg-[#0F172A] flex items-center justify-center transition-colors">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  const totalHabits = habits.length;
  const totalCompleted = checkIns.filter(c => c.completed).length;

  const chartData = Array.from({ length: 7 }).map((_, index) => {
    const d = subDays(new Date(), 6 - index);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayName = format(d, 'EEE'); 
    const completedCount = checkIns.filter(c => c.date === dateStr && c.completed).length;
    return { name: dayName, completed: completedCount };
  });

  return (
    <div className="min-h-screen relative font-sans selection:bg-indigo-100 pb-24 overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/20 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 pointer-events-none animate-pulse"></div>

      <main className="max-w-xl mx-auto px-5 pt-12 relative z-10">
        
        <div className="mb-10 animate-fade-in-up">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 pb-1">
              Analytics
            </span> 
            <span className="text-4xl drop-shadow-md">📈</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Tracking your journey to success.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          
          <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-7 rounded-[2rem] shadow-sm border border-white/60 dark:border-slate-700/50 hover:shadow-[0_12px_40px_rgba(79,70,229,0.15)] hover:-translate-y-1.5 transition-all duration-500 ease-out" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
                <span className="text-2xl drop-shadow-sm">🎯</span>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Tracking</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg leading-tight">Total Habits</p>
              </div>
            </div>
            <p className="text-5xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{totalHabits}</p>
          </div>

          <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-7 rounded-[2rem] shadow-sm border border-white/60 dark:border-slate-700/50 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1.5 transition-all duration-500 ease-out" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-sm border border-green-100/50 dark:border-green-500/20">
                <span className="text-2xl drop-shadow-sm">🔥</span>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">All Time</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg leading-tight">Completed</p>
              </div>
            </div>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 drop-shadow-sm">{totalCompleted}</p>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-white/60 dark:border-slate-700/50 transition-all duration-500 animate-fade-in-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Past 7 Days</h3>
            <span className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">Activity</span>
          </div>
          
          {/* FIX: Height badhayi aur margin bottom 25 add kiya taaki din (Mon, Tue) na kate */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="colorEmpty" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e2e8f0" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.08)', rx: 16 }} 
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} 
                  dy={15}
                />
                <Bar dataKey="completed" radius={[10, 10, 10, 10]} barSize={36}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.completed > 0 ? 'url(#colorUv)' : 'url(#colorEmpty)'} 
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer drop-shadow-sm"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}