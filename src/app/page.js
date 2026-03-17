'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import HabitCard from '@/components/HabitCard';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    Promise.all([
      fetch('/api/habits').then(r => r.json()),
      fetch(`/api/checkin?date=${today}`).then(r => r.json())
    ]).then(([habitsData, checkInsData]) => {
      setHabits(habitsData);
      setCheckIns(checkInsData);
      setLoading(false);
    });
  }, [today]);

  const toggleHabit = async (habitId) => {
    const existing = checkIns.find(c => c.habitId === habitId);
    const newStatus = !existing?.completed;
    
    setCheckIns(prev => {
      if (existing) return prev.map(c => c.habitId === habitId ? { ...c, completed: newStatus } : c);
      return [...prev, { habitId, date: today, completed: newStatus }];
    });

    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId, date: today, completed: newStatus })
    });
  };

  // Naya Delete function
  const deleteHabit = async (habitId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    // UI se turant hatao
    setHabits(prev => prev.filter(h => h._id !== habitId));
    
    // Database se delete karo
    await fetch(`/api/habits/${habitId}`, {
      method: 'DELETE',
    });
  };

  const isCompleted = (habitId) => checkIns.find(c => c.habitId === habitId)?.completed || false;
  const completedCount = habits.filter(h => isCompleted(h._id)).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
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
                  isCompleted={isCompleted(habit._id)} 
                  onToggle={toggleHabit} 
                  onDelete={deleteHabit}
                />
              </div>
            ))
          ) : (
             <div className="text-center py-16 animate-fade-in-up">
               <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-5">
                 <span className="text-3xl">📝</span>
               </div>
               <h3 className="text-lg font-semibold text-slate-800">Clear Canvas</h3>
               <p className="text-slate-500 text-sm mt-1">Start by adding your first habit below.</p>
             </div>
          )}
        </div>

        <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50">
          <a 
            href="/add-habit"
            className="pointer-events-auto bg-slate-900 text-white px-7 py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.2)] hover:-translate-y-1 hover:bg-indigo-600 transition-all duration-300 font-medium flex items-center gap-2.5 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Habit
          </a>
        </div>
      </main>
    </div>
  );
}