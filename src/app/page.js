'use client';
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import HabitCard from '@/components/HabitCard';

export default function Dashboard() {
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const last7Days = Array.from({ length: 7 }).map((_, index) => format(subDays(new Date(), 6 - index), 'yyyy-MM-dd'));

  useEffect(() => {
    Promise.all([fetch('/api/habits').then(r => r.json()), fetch('/api/checkin').then(r => r.json())])
      .then(([habitsData, checkInsData]) => { setHabits(habitsData); setCheckIns(checkInsData); setLoading(false); });
  }, []);

  const toggleHabit = async (habitId) => {
    const existing = checkIns.find(c => c.habitId === habitId && c.date === today);
    const newStatus = !existing?.completed;
    setCheckIns(prev => {
      if (existing) return prev.map(c => (c.habitId === habitId && c.date === today) ? { ...c, completed: newStatus } : c);
      return [...prev, { habitId, date: today, completed: newStatus }];
    });
    await fetch('/api/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ habitId, date: today, completed: newStatus }) });
  };

  const deleteHabit = async (habitId) => {
    if (!window.confirm("Delete this habit?")) return;
    setHabits(prev => prev.filter(h => h._id !== habitId));
    await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
  };

  const isCompletedToday = (habitId) => checkIns.find(c => c.habitId === habitId && c.date === today)?.completed || false;
  const completedCount = habits.filter(h => isCompletedToday(h._id)).length;

  if (loading) return (
    <div className="min-h-screen bg-[#F3F5F8] dark:bg-[#0F172A] flex items-center justify-center transition-colors">
      <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen pb-28 sm:pb-32 font-sans selection:bg-indigo-100">
      <main className="max-w-xl mx-auto px-4 sm:px-5">
        
        <Header totalHabits={habits.length} completedHabits={completedCount} />

        <div className="space-y-2.5 sm:space-y-3 relative z-10">
          {habits.length > 0 ? (
            habits.map((habit, index) => (
              <div key={habit._id} style={{ animationDelay: `${index * 80}ms` }} className="animate-fade-in-up">
                <HabitCard habit={habit} isCompleted={isCompletedToday(habit._id)} onToggle={toggleHabit} onDelete={deleteHabit} onEdit={(id) => router.push(`/edit-habit/${id}`)} habitCheckIns={checkIns.filter(c => c.habitId === habit._id)} last7Days={last7Days} today={today} />
              </div>
            ))
          ) : (
             <div className="text-center py-12 sm:py-16 animate-fade-in-up">
               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-slate-800 rounded-[1rem] sm:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-4 transition-colors">
                 <span className="text-2xl sm:text-3xl">📝</span>
               </div>
               <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white transition-colors">Clear Canvas</h3>
               <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Start by adding your first habit.</p>
             </div>
          )}
        </div>

        {/* Floating App-like Bottom Dock for Phone */}
        <div className="fixed bottom-6 sm:bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50 px-4">
          <div className="pointer-events-auto w-full max-w-[min(100%,22rem)] sm:w-auto bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl p-1.5 sm:p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex items-center justify-between sm:justify-center gap-1 sm:gap-2 border border-slate-700/50">
            <a href="/analytics" className="text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-full hover:bg-slate-800 dark:hover:bg-slate-700 transition-all font-medium text-sm sm:text-base flex items-center gap-1.5 flex-1 sm:flex-none justify-center">
              📊 <span className="hidden sm:inline">Stats</span><span className="inline sm:hidden">Stats</span>
            </a>
            <div className="w-[1px] h-6 sm:h-8 bg-slate-700/50"></div>
            <a href="/add-habit" className="bg-indigo-600 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full shadow-md hover:bg-indigo-500 active:scale-95 transition-all font-medium text-sm sm:text-base flex items-center gap-1.5 flex-1 sm:flex-none justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Habit
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}