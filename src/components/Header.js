import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function Header({ totalHabits, completedHabits }) {
  const progress = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
  const [celebrated, setCelebrated] = useState(false);

  // 100% hone par Confetti Animation ka logic
  useEffect(() => {
    if (progress === 100 && totalHabits > 0 && !celebrated) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']
      });
      setCelebrated(true);
    } else if (progress < 100) {
      setCelebrated(false);
    }
  }, [progress, totalHabits, celebrated]);

  return (
    <header className="mb-10 pt-8 animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {progress === 100 ? 'All Done! 🎉' : 'Good Morning'}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}></span>
            {format(new Date(), 'EEEE, d MMMM')}
          </p>
        </div>
        
        <div className="text-right">
          <p className={`text-3xl font-bold ${progress === 100 ? 'text-green-500' : 'text-slate-800'}`}>
            {progress}%
          </p>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Done</p>
        </div>
      </div>
      
      <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-indigo-600'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}