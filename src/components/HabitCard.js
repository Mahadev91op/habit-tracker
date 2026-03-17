import { format, subDays } from 'date-fns';

export default function HabitCard({ habit, isCompleted, onToggle, onDelete, onEdit, habitCheckIns, last7Days, today }) {
  let currentStreak = 0;
  let checkDate = new Date(today);
  
  while (true) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    const isDone = habitCheckIns.some(c => c.date === dateStr && c.completed);
    if (isDone) { currentStreak++; checkDate = subDays(checkDate, 1); } 
    else { if (dateStr === today) { checkDate = subDays(checkDate, 1); continue; } break; }
  }

  return (
    <div className={`group relative flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4.5 rounded-[1.25rem] sm:rounded-2xl transition-all duration-300 ease-out ${isCompleted ? 'bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 opacity-60 shadow-sm' : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-indigo-200'}`}>
      
      <div onClick={() => onToggle(habit._id)} className={`w-6 h-6 sm:w-7 sm:h-7 mt-0.5 sm:mt-1 self-start cursor-pointer rounded-lg sm:rounded-xl border-[1.5px] flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-slate-400 dark:bg-slate-500 border-slate-400 dark:border-slate-500' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600'}`}>
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transition-all duration-300 ${isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      
      <div className="flex-1 ml-0.5 sm:ml-1 cursor-pointer" onClick={() => onToggle(habit._id)}>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
          <p className={`text-[0.95rem] sm:text-[1.05rem] leading-tight font-medium transition-all duration-300 mr-1 ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
            {habit.name}
          </p>
          
          {habit.targetTime && (
            <span className={`px-1.5 sm:px-2 py-0.5 rounded sm:rounded-md text-[9px] sm:text-[10px] font-bold transition-colors tracking-wide ${isCompleted ? 'bg-transparent text-slate-400' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300'}`}>
              ⏰ {habit.targetTime}
            </span>
          )}
          {currentStreak > 0 && (
            <span className={`px-1.5 sm:px-2 py-0.5 rounded sm:rounded-md text-[9px] sm:text-[10px] font-bold tracking-wide flex items-center gap-1 transition-all ${isCompleted ? 'bg-orange-50/50 dark:bg-orange-900/10 text-orange-400/50' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm'}`}>
              🔥 {currentStreak} Day{currentStreak > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Compact Mini Calendar for Phone */}
        <div className="flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-2.5">
          {last7Days.map((dateStr) => {
            const isDone = habitCheckIns.some(c => c.date === dateStr && c.completed);
            const isToday = dateStr === today;
            const dayInitial = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'narrow' });
            return (
              <div key={dateStr} title={dateStr} className={`w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] rounded sm:rounded-md flex items-center justify-center text-[8px] sm:text-[9px] font-bold transition-all ${isDone ? 'text-white shadow-[0_2px_8px_rgba(99,102,241,0.3)] scale-105' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400'} ${isToday && !isDone ? 'ring-[1.5px] sm:ring-2 ring-slate-200 dark:ring-slate-600 ring-offset-1' : ''}`} style={isDone ? { backgroundColor: habit.color || '#4f46e5' } : {}}>
                {dayInitial}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 self-start -mr-1">
        <button onClick={(e) => { e.stopPropagation(); onEdit(habit._id); }} className="p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-500 rounded-lg sm:rounded-xl">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(habit._id); }} className="p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 rounded-lg sm:rounded-xl">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      {!isCompleted && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-6 sm:h-8 rounded-r-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all pointer-events-none" style={{ backgroundColor: habit.color || '#4f46e5' }} />}
    </div>
  );
}