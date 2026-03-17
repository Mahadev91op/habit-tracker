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

  // Purana data fetch karo
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
    <div className="min-h-screen bg-[#F3F5F8] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pt-12 font-sans selection:bg-indigo-100 pb-20">
      <main className="max-w-md w-full mx-auto px-5 animate-fade-in-up">
        
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm mb-6"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Habit</h1>
          <p className="text-slate-500 mt-2 text-sm">Make changes to your routine</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Habit Name</label>
              <input 
                type="text" required autoFocus
                placeholder="e.g. Read 10 pages, Drink water"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Target Time <span className="text-slate-400 font-normal">(Optional)</span></label>
              <input 
                type="time"
                value={form.targetTime}
                onChange={e => setForm({...form, targetTime: e.target.value})}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Theme Color</label>
              <div className="flex gap-3 flex-wrap">
                {COLORS.map(color => (
                  <button
                    key={color} type="button"
                    onClick={() => setForm({...form, color})}
                    className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center
                      ${form.color === color ? 'scale-110 ring-4 ring-offset-2' : 'hover:scale-105'}
                    `}
                    style={{ 
                      backgroundColor: color,
                      '--tw-ring-color': `${color}40`
                    }}
                  >
                    {form.color === color && (
                      <svg className="w-5 h-5 text-white animate-fade-in-up" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading || !form.name.trim()}
                className={`w-full py-4 rounded-2xl text-white font-semibold flex justify-center items-center gap-2 transition-all duration-300
                  ${loading || !form.name.trim() 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-[0_8px_30px_rgba(79,70,229,0.2)] hover:-translate-y-0.5 active:scale-[0.98]'}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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