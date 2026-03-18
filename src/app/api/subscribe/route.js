import connectMongo from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectMongo();
    const subscriptionData = await req.json();
    
    // Nayi subscription save karo ya existing endpoint ko update karo
    await Subscription.findOneAndUpdate(
      { endpoint: subscriptionData.endpoint },
      subscriptionData,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: "Subscription saved!" });
  } catch (error) {
    console.error("DB Save Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}