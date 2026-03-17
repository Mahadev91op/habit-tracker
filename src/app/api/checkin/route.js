import { connectDB } from '@/lib/mongodb';
import CheckIn from '@/models/CheckIn';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectDB();
  const { habitId, date, completed } = await request.json();
  
  // Agar aaj ka record hai to update, nahi to create
  const checkIn = await CheckIn.findOneAndUpdate(
    { habitId, date },
    { completed },
    { upsert: true, new: true }
  );
  return NextResponse.json(checkIn);
}

// Kisi date ke saare check-ins fetch karo
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const checkIns = await CheckIn.find({ date });
  return NextResponse.json(checkIns);
}