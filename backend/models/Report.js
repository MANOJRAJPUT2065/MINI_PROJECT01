import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportUrl: { type: String, required: true },
    publicId: { type: String, required: true },
 
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;
