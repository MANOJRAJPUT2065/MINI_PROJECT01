import mongoose from 'mongoose';

const DoctorClaimSchema = new mongoose.Schema({
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', // Reference to the Doctor model
        required: true,
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v); // Ensure doctorId is a valid ObjectId
            },
            message: props => `${props.value} is not a valid doctorId!`
        }
    },
    patientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', // Reference to the Patient model
        required: true,
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v); // Ensure patientId is a valid ObjectId
            },
            message: props => `${props.value} is not a valid patientId!`
        }
    },
    diagnosis: { 
        type: String, 
        required: true 
    },
    treatment: { 
        type: String, 
        required: true 
    },
    claimAmount: { 
        type: Number, 
        required: true 
    },
    claimDate: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    notes: { 
        type: String 
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

export default mongoose.model('DoctorClaim', DoctorClaimSchema);
