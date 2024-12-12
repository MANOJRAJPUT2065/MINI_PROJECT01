import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    notificationId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readStatus: { type: Boolean, default: false }, // Track whether the notification has been read
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
