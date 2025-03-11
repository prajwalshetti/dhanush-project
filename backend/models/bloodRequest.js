import mongoose from 'mongoose';

const BloodRequestSchema = new mongoose.Schema({
    requester_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    blood_group: { 
        type: String, 
        required: true 
    },
    units_needed: { 
        type: Number, 
        required: true 
    },
    hospital: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    urgency_level: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'fulfilled', 'cancelled'], 
        default: 'pending' 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    fulfilled_at: { 
        type: Date 
    }
}, { timestamps: true });

export default mongoose.model('BloodRequest', BloodRequestSchema);
