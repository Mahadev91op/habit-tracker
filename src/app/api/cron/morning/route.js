import connectMongo from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import webpush from 'web-push';
import { NextResponse } from 'next/server';

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`, // mailto: laga hona zaroori hai env file me ya yahan
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function GET(req) {
  try {
    // Vercel Cron Authentication (Security ke liye)
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectMongo();
    const subscribers = await Subscription.find();
    
    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers" });
    }

    const payload = JSON.stringify({
      title: "Morning Check-in! ☀️",
      body: "Bhai, aaj ka workout aur habits miss mat karna! App check karo.",
      url: "/"
    });

    const notifications = subscribers.map(sub => 
      webpush.sendNotification(sub, payload).catch(e => {
        // Agar user ne permission hta di hai (410 Gone), toh DB se delete kar do
        if (e.statusCode === 410 || e.statusCode === 404) {
          return Subscription.deleteOne({ endpoint: sub.endpoint });
        }
        console.error("Push Error:", e);
      })
    );
    
    await Promise.all(notifications);

    return NextResponse.json({ success: true, message: "Morning reminders sent!" });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}