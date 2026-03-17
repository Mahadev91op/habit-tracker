import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  targetTime: String,       // e.g. "07:00 AM"
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily'
  },
  color: { type: String, default: '#6366f1' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema);