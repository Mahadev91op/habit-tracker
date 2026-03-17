import { format } from 'date-fns';

export default function Header({ totalHabits, completedHabits }) {
  const progress = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  return (
    <header className="mb-10 pt-8 animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Good Morning
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            {format(new Date(), 'EEEE, d MMMM')}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-800">{progress}%</p>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">Done</p>
        </div>
      </div>
      
      <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}