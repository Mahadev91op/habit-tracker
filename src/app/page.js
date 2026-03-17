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

  const last7Days = Array.from({ length: 7 }).map((_, index) => {
    return format(subDays(new Date(), 6 - index), 'yyyy-MM-dd');
  });

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

  const toggleHabit = async (habitId) => {
    const existing = checkIns.find(c => c.habitId === habitId && c.date === today);
    const newStatus = !existing?.completed;
    
    setCheckIns(prev => {
      if (existing) {
        return prev.map(c => (c.habitId === habitId && c.date === today) ? { ...c, completed: newStatus } : c);
      }
      return [...prev, { habitId, date: today, completed: newStatus }];
    });

    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId, date: today, completed: newStatus })
    });
  };

  const deleteHabit = async (habitId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    setHabits(prev => prev.filter(h => h._id !== habitId));
    await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
  };

  const editHabit = (habitId) => {
    router.push(`/edit-habit/${habitId}`);
  };

  const isCompletedToday = (habitId) => checkIns.find(c => c.habitId === habitId && c.date === today)?.completed || false;
  const completedCount = habits.filter(h => isCompletedToday(h._id)).length;

  if (loading) return (
    <div className="min-h-screen bg-[#F3F5F8] dark:bg-[#0F172A] flex items-center justify-center transition-colors">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 font-sans selection:bg-indigo-100">
      <main className="max-w-xl mx-auto px-5">
        
        <Header totalHabits={habits.length} completedHabits={completedCount} />

        <div className="space-y-3 relative z-10">
          {habits.length > 0 ? (
            habits.map((habit, index) => (
              <div key={habit._id} style={{ animationDelay: `${index * 80}ms` }} className="animate-fade-in-up">
                <HabitCard 
                  habit={habit} 
                  isCompleted={isCompletedToday(habit._id)} 
                  onToggle={toggleHabit} 
                  onDelete={deleteHabit}
                  onEdit={editHabit}
                  habitCheckIns={checkIns.filter(c => c.habitId === habit._id)}
                  last7Days={last7Days}
                  today={today}
                />
              </div>
            ))
          ) : (
             <div className="text-center py-16 animate-fade-in-up">
               <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-5 transition-colors">
                 <span className="text-3xl">📝</span>
               </div>
               <h3 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors">Clear Canvas</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Start by adding your first habit below.</p>
             </div>
          )}
        </div>

        {/* Naya Floating Bar (Add Habit + Analytics) */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50">
          <div className="pointer-events-auto bg-slate-900 dark:bg-slate-800 p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2 border border-slate-700/50">
            <a 
              href="/analytics"
              className="text-white px-5 py-3 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 font-medium flex items-center gap-2"
            >
              📊 Stats
            </a>
            <div className="w-[1px] h-8 bg-slate-700"></div>
            <a 
              href="/add-habit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-md hover:bg-indigo-500 hover:-translate-y-0.5 transition-all duration-300 font-medium flex items-center gap-2 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Habit
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}