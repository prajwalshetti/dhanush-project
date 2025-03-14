import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    blood_group: { type: String, required: true },
    city: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    last_donation_date: { type: Date, default: null },
    health_status: { type: String, default: '' },
}, { timestamps: true });




export default mongoose.model('User' , UserSchema)