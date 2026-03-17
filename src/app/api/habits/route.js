import { connectDB } from '@/lib/mongodb';
import Habit from '@/models/Habit';
import { NextResponse } from 'next/server';

// Saare habits fetch karo
export async function GET() {
  await connectDB();
  const habits = await Habit.find({}).sort({ createdAt: -1 });
  return NextResponse.json(habits);
}

// Naya habit banao
export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const habit = await Habit.create(body);
  return NextResponse.json(habit, { status: 201 });
}