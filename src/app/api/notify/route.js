import webpush from 'web-push';
import { NextResponse } from 'next/server';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
  const { subscription, title, body } = await request.json();

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body, url: '/' })
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}