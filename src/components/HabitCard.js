import { format, subDays } from 'date-fns';

export default function HabitCard({ habit, isCompleted, onToggle, onDelete, habitCheckIns, last7Days, today }) {
  
  // Streak Calculation Logic (Lagatar kitne din habit ki gayi)
  let currentStreak = 0;
  let checkDate = new Date(today);
  
  while (true) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    const isDone = habitCheckIns.some(c => c.date === dateStr && c.completed);
    
    if (isDone) {
      currentStreak++;
      checkDate = subDays(checkDate, 1); // Ek din pichhe jao
    } else {
      // Agar aaj complete nahi hai, par kal ki thi, toh streak tooti nahi hai, bas aaj count nahi hui
      if (dateStr === today) {
        checkDate = subDays(checkDate, 1);
        continue;
      }
      break; // Streak toot gayi
    }
  }

  return (
    <div 
      className={`group relative flex items-center gap-4 p-4.5 rounded-2xl transition-all duration-300 ease-out
        ${isCompleted 
          ? 'bg-slate-50/60 border border-slate-200/60 opacity-60 shadow-sm' 
          : 'bg-white border border-slate-200 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-indigo-200'}`}
    >
      {/* Checkbox */}
      <div 
        onClick={() => onToggle(habit._id)}
        className={`w-7 h-7 mt-1 self-start cursor-pointer rounded-xl border-[1.5px] flex items-center justify-center transition-all duration-300 ease-out
          ${isCompleted 
            ? 'bg-slate-400 border-slate-400' 
            : 'bg-slate-50 border-slate-300 group-hover:border-indigo-400 group-hover:bg-indigo-50/50'}`}
      >
        <svg 
          className={`w-4 h-4 text-white transition-all duration-300 ease-out ${isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      {/* Text aur Badges */}
      <div className="flex-1 ml-1 cursor-pointer" onClick={() => onToggle(habit._id)}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className={`text-[1.05rem] font-medium transition-all duration-300 mr-1 ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
            {habit.name}
          </p>
          
          {/* Target Time */}
          {habit.targetTime && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors duration-300 tracking-wide
              ${isCompleted ? 'bg-transparent text-slate-400' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
              ⏰ {habit.targetTime}
            </span>
          )}

          {/* 🔥 Premium Streak Badge */}
          {currentStreak > 0 && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide flex items-center gap-1 transition-all duration-300
              ${isCompleted ? 'bg-orange-50/50 text-orange-400/50' : 'bg-orange-50 text-orange-600 shadow-sm'}`}>
              🔥 {currentStreak} Day{currentStreak > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* 7-Day History Mini Calendar */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {last7Days.map((dateStr) => {
            const isDone = habitCheckIns.some(c => c.date === dateStr && c.completed);
            const isToday = dateStr === today;
            const dayInitial = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'narrow' });
            
            return (
              <div 
                key={dateStr} title={dateStr}
                className={`w-[22px] h-[22px] rounded-md flex items-center justify-center text-[9px] font-bold transition-all duration-300
                  ${isDone 
                    ? 'bg-indigo-500 text-white shadow-[0_2px_8px_rgba(99,102,241,0.3)] scale-105' 
                    : 'bg-slate-100 text-slate-400'}
                  ${isToday && !isDone ? 'ring-2 ring-slate-200 ring-offset-1' : ''}
                `}
                style={isDone ? { backgroundColor: habit.color || '#4f46e5' } : {}}
              >
                {dayInitial}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(habit._id); }}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 self-start -mr-1"
        title="Delete Habit"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Color Accent Line */}
      {!isCompleted && (
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          style={{ backgroundColor: habit.color || '#4f46e5' }}
        />
      )}
    </div>
  );
}