import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from 'next-themes';

export default function Header({ totalHabits, completedHabits }) {
  const progress = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
  const [celebrated, setCelebrated] = useState(false);
  
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  return (
    <header className="mb-10 pt-8 animate-fade-in-up">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
            {progress === 100 ? 'All Done! 🎉' : 'Good Morning'}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2 transition-colors">
            <span className={`w-2 h-2 rounded-full animate-pulse ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}></span>
            {format(new Date(), 'EEEE, d MMMM')}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {/* Animated Dark Mode Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="relative w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-110 hover:shadow-md active:scale-95 transition-all duration-300 overflow-hidden group"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {/* Sun Icon (Dark Mode me dikhega taaki light mode me ja sake) */}
              <svg 
                className={`absolute w-5 h-5 text-yellow-500 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>

              {/* Moon Icon (Light Mode me dikhega taaki dark mode me ja sake) */}
              <svg 
                className={`absolute w-5 h-5 text-indigo-500 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${!isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          )}

          <div className="text-right">
            <p className={`text-3xl font-bold transition-colors ${progress === 100 ? 'text-green-500' : 'text-slate-800 dark:text-slate-100'}`}>
              {progress}%
            </p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Done</p>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-slate-200/50 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden transition-colors">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-indigo-600'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}