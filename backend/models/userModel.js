import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    blood_group: { type: String, required: true },
    location: {
        type: {
          latitude: {
            type: Number,
            default: 0
          },
          longitude: {
            type: Number,
            default: 0
          }
        },
        default: {
          latitude: 0,
          longitude: 0
        }
      },
    is_active: { type: Boolean, default: true },
    last_donation_date: { type: Date, default: null },
    health_status: { type: String, default: '' },
   
}, { timestamps: true });




export default mongoose.model('User' , UserSchema)