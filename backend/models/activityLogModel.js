import mongoose from 'mongoose';

// Define the schema for Activity Log
const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Check if the model is already defined to avoid recompiling
const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
