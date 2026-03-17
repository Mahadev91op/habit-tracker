import mongoose from 'mongoose';

const CheckInSchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: String, required: true },  // "2024-01-15" format
  completed: { type: Boolean, default: false },
  note: String
});

export default mongoose.models.CheckIn || mongoose.model('CheckIn', CheckInSchema);