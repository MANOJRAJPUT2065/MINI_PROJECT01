// models/Analytics.js
import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  rejectionReasons: [{
    name: { type: String },
    count: { type: Number }
  }],
  fraudRisk: { type: String }
}, { timestamps: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
