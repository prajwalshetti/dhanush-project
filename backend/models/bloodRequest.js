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
    location_coordinates: { 
        type: { lat: Number, lng: Number }
    },
    urgency_level: { 
        type: String, 
        enum: ['normal', 'urgent', 'emergency'], 
        required: true 
    },
    reason: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['pending', 'fulfilled', 'cancelled'], 
        default: 'pending' 
    },
    fulfilled_at: { 
        type: Date 
    }
}, { timestamps: true });

export default mongoose.model('BloodRequest', BloodRequestSchema);
