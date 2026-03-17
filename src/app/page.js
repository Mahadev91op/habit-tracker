'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const today = format(new Date(), 'yyyy-MM-dd');

  // Habits aur aaj ke check-ins fetch karo
  useEffect(() => {
    fetch('/api/habits').then(r => r.json()).then(setHabits);
    fetch(`/api/checkin?date=${today}`).then(r => r.json()).then(setCheckIns);
  }, []);

  // Habit complete karo ya uncomplete
  const toggleHabit = async (habitId) => {
    const existing = checkIns.find(c => c.habitId === habitId);
    const newStatus = !existing?.completed;
    
    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId, date: today, completed: newStatus })
    });
    
    // Local state update karo
    fetch(`/api/checkin?date=${today}`).then(r => r.json()).then(setCheckIns);
  };

  const isCompleted = (habitId) => 
    checkIns.find(c => c.habitId === habitId)?.completed || false;

  const completedCount = habits.filter(h => isCompleted(h._id)).length;

  return (
    <main className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Aaj ka din 🌅</h1>
        <p className="text-gray-500 mt-1">{format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
        
        {/* Progress bar */}
        <div className="mt-4 bg-gray-100 rounded-full h-3">
          <div 
            className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: habits.length ? `${(completedCount/habits.length)*100}%` : '0%' }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{completedCount}/{habits.length} habits complete</p>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map(habit => (
          <div 
            key={habit._id}
            onClick={() => toggleHabit(habit._id)}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
              ${isCompleted(habit._id) 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-indigo-300'}`}
          >
            {/* Color dot */}
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm
                ${isCompleted(habit._id) ? 'bg-green-500' : ''}`}
              style={!isCompleted(habit._id) ? { backgroundColor: habit.color } : {}}
            >
              {isCompleted(habit._id) ? '✓' : ''}
            </div>
            
            <div className="flex-1">
              <p className={`font-medium ${isCompleted(habit._id) ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {habit.name}
              </p>
              {habit.targetTime && (
                <p className="text-xs text-gray-400">⏰ {habit.targetTime}</p>
              )}
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📝</p>
            <p>Koi habit nahi hai abhi</p>
            <p className="text-sm">Neeche "Add Habit" button se shuru karo</p>
          </div>
        )}
      </div>

      {/* Add Habit Button */}
      <a 
        href="/add-habit"
        className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        + Habit Add Karo
      </a>
    </main>
  );
}