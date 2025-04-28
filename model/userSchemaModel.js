import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    role: {
        type: [String],
        trim: true,
        required: true,
        enum: ['client', 'admin'], 
        default: 'client'
    },
},{
    timestamps:true,
})
   // create model 
 const UserModel = mongoose.model('user', userSchema);
 export default UserModel;