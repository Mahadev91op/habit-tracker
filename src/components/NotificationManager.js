'use client';
import { useEffect, useState } from 'react';

// VAPID key ko binary format me convert karne ka helper function
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.error('Service Worker Error:', error);
    }
  }

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        const convertedVapidKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });

        // Backend API ko call karke DB me save karna
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        });

        const data = await res.json();
        
        if (data.success) {
          console.log("Subscription saved in Database:", subscription);
          setIsSubscribed(true);
          alert("Smart Notifications ON ho gayi hain! 🔔");
        }
      } catch (error) {
        console.error("Push Subscription Error:", error);
      }
    } else {
      alert("Aapne notifications ki permission nahi di.");
    }
  }

  // Agar browser support nahi karta ya user pehle hi subscribe kar chuka hai, toh button hide kar do
  if (!isSupported || isSubscribed) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <button
        onClick={requestPermission}
        title="Enable Reminders"
        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:scale-110 transition-all group"
      >
        <span className="text-xl group-hover:animate-bounce block">🔔</span>
      </button>
    </div>
  );
}