import { connectDB } from '@/lib/mongodb';
import Habit from '@/models/Habit';
import CheckIn from '@/models/CheckIn';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  await connectDB();
  
  // URL se habit ka ID nikalenge
  const { id } = await params;

  // Habit ko delete karo
  await Habit.findByIdAndDelete(id);
  
  // Us habit ke purane saare check-ins (history) bhi delete kar do
  await CheckIn.deleteMany({ habitId: id });

  return NextResponse.json({ message: 'Habit deleted successfully' });
}