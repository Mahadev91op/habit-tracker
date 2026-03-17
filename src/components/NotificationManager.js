'use client';
import { useEffect, useState } from 'react';

export default function NotificationManager() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  }

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // Is subscription data ko hum database me save kar sakte hain
      console.log("Subscription saved:", subscription);
      // Abhi ke liye hum ise localStorage me rakh rahe hain debug ke liye
      localStorage.setItem('push_sub', JSON.stringify(subscription));
      alert("Notifications ON ho gayi hain! 🔔");
    }
  }

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <button
        onClick={requestPermission}
        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:scale-110 transition-all group"
      >
        <span className="text-xl group-hover:animate-bounce block">🔔</span>
      </button>
    </div>
  );
}