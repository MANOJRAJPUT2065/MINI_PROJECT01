import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const userManagementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model for user details
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'approver', 'auditor', 'user'], // Example roles
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    activityLogs: [activityLogSchema], // List of actions done by the user
  },
  { timestamps: true }
);

const UserManagement = mongoose.model('UserManagement', userManagementSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export { UserManagement, ActivityLog };
