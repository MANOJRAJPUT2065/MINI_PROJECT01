import mongoose from 'mongoose';  // ESM import

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, required: true },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;  
