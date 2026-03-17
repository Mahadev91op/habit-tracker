'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function AddHabit() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', description: '', targetTime: '', 
    frequency: 'daily', color: '#6366f1'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    router.push('/');
  };

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Naya Habit Banao</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Habit ka naam *</label>
          <input 
            type="text" required
            placeholder="e.g. Subah exercise karna"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Target time</label>
          <input 
            type="time"
            value={form.targetTime}
            onChange={e => setForm({...form, targetTime: e.target.value})}
            className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Rang chuno</label>
          <div className="flex gap-3">
            {COLORS.map(color => (
              <button
                key={color} type="button"
                onClick={() => setForm({...form, color})}
                className={`w-8 h-8 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button" onClick={() => router.back()}
            className="flex-1 border border-gray-200 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Karo ✓
          </button>
        </div>
      </form>
    </main>
  );
}