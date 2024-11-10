import mongoose from 'mongoose';  // Use ESM import

const complianceSchema = new mongoose.Schema({
  feature: { type: String, required: true },
  description: { type: String, required: true },
  isCompliant: { type: Boolean, required: true }
});

const Compliance = mongoose.model('Compliance', complianceSchema);

export default Compliance;  // ESM export
