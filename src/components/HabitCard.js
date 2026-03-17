export default function HabitCard({ habit, isCompleted, onToggle }) {
  return (
    <div 
      onClick={() => onToggle(habit._id)}
      className={`group relative flex items-center gap-4 p-4.5 rounded-2xl cursor-pointer transition-all duration-300 ease-out
        ${isCompleted 
          ? 'bg-slate-50/60 border border-slate-200/60 opacity-60 shadow-sm' 
          : 'bg-white border border-slate-200 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-indigo-200'}`}
    >
      <div 
        className={`w-7 h-7 rounded-xl border-[1.5px] flex items-center justify-center transition-all duration-300 ease-out
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
      
      <div className="flex-1 ml-1">
        <p className={`text-[1.05rem] font-medium transition-all duration-300 ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
          {habit.name}
        </p>
      </div>

      {habit.targetTime && (
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-300 tracking-wide
          ${isCompleted ? 'bg-transparent text-slate-400' : 'bg-[#F3F5F8] text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
          {habit.targetTime}
        </div>
      )}

      {!isCompleted && (
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-md opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ backgroundColor: habit.color || '#4f46e5' }}
        />
      )}
    </div>
  );
}