'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e'];

export default function EditHabit() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: '', targetTime: '', frequency: 'daily', color: '#4f46e5'
  });

  useEffect(() => {
    fetch(`/api/habits/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name || '',
          targetTime: data.targetTime || '',
          frequency: data.frequency || 'daily',
          color: data.color || '#4f46e5'
        });
        setFetching(false);
      });
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/habits/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    router.push('/');
  };

  if (fetching) return (
    <div className="min-h-screen bg-[#F3F5F8] dark:bg-[#0F172A] flex items-center justify-center transition-colors">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen relative font-sans selection:bg-indigo-100 pb-20 sm:pb-24 overflow-x-hidden flex flex-col pt-6 sm:pt-12">
      
      {/* Premium Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none"></div>

      <main className="max-w-md w-full mx-auto px-4 sm:px-5 relative z-10 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm mb-4 sm:mb-6 group"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit Habit <span className="drop-shadow-sm">✏️</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base font-medium">Make changes to your routine</p>
        </div>
        
        {/* Form Box */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-7 shadow-sm border border-white/60 dark:border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Habit Name</label>
              <input 
                type="text" required autoFocus
                placeholder="e.g. Read 10 pages, Workout"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-base sm:text-lg font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Target Time <span className="text-slate-400/70 dark:text-slate-500/70 normal-case font-medium tracking-normal">(Optional)</span></label>
              <input 
                type="time"
                value={form.targetTime}
                onChange={e => setForm({...form, targetTime: e.target.value})}
                className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all appearance-none text-base sm:text-lg font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Theme Color</label>
              <div className="flex gap-2.5 sm:gap-3 flex-wrap">
                {COLORS.map(color => (
                  <button
                    key={color} type="button"
                    onClick={() => setForm({...form, color})}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 flex items-center justify-center
                      ${form.color === color ? 'scale-110 ring-[3px] sm:ring-4 ring-offset-2 dark:ring-offset-slate-800' : 'hover:scale-105 shadow-sm'}
                    `}
                    style={{ 
                      backgroundColor: color,
                      '--tw-ring-color': `${color}80` 
                    }}
                  >
                    {form.color === color && (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-fade-in-up" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 mt-2">
              <button
                type="submit"
                disabled={loading || !form.name.trim()}
                className={`w-full py-4 sm:py-4.5 rounded-xl sm:rounded-2xl text-white font-bold text-base sm:text-lg flex justify-center items-center gap-2 transition-all duration-300
                  ${loading || !form.name.trim() 
                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:scale-[0.98]'}`}
              >
                {loading ? (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Save Changes ✓'
                )}
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}