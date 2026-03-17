import { connectDB } from '@/lib/mongodb';
import Habit from '@/models/Habit';
import CheckIn from '@/models/CheckIn';
import { NextResponse } from 'next/server';

// Single habit ka data lane ke liye (Edit page me dikhane ke liye)
export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const habit = await Habit.findById(id);
  return NextResponse.json(habit);
}

// Habit ko update karne ke liye
export async function PUT(request, { params }) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const updatedHabit = await Habit.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updatedHabit);
}

// Habit ko delete karne ke liye (Purana logic)
export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = await params;
  await Habit.findByIdAndDelete(id);
  await CheckIn.deleteMany({ habitId: id });
  return NextResponse.json({ message: 'Habit deleted successfully' });
}