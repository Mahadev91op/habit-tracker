import { connectDB } from '@/lib/mongodb';
import Habit from '@/models/Habit';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  await connectDB();
  const body = await request.json();
  const habit = await Habit.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(habit);
}

export async function DELETE(request, { params }) {
  await connectDB();
  await Habit.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Habit deleted' });
}