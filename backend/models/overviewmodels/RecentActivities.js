import mongoose from 'mongoose';

const recentActivitiesSchema = new mongoose.Schema({
    activityId: { type: String, required: true, unique: true },
    claimId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const RecentActivities = mongoose.model('RecentActivities', recentActivitiesSchema);

export default RecentActivities;
