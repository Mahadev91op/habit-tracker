import { connectDB } from '@/lib/mongodb';
import CheckIn from '@/models/CheckIn';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectDB();
  const { habitId, date, completed } = await request.json();
  
  // Agar record hai to update, nahi to create
  const checkIn = await CheckIn.findOneAndUpdate(
    { habitId, date },
    { completed },
    { upsert: true, new: true }
  );
  return NextResponse.json(checkIn);
}

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  
  // NAYA LOGIC: Agar URL me 'date' diya hai to us din ka fetch karo, 
  // nahi toh saari history fetch kar lo!
  const query = date ? { date } : {}; 
  const checkIns = await CheckIn.find(query);
  return NextResponse.json(checkIns);
}