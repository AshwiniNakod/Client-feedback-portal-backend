import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    text: {
        type: String,
        trim: true,
        required: true,
    },
    rating: {
        type: Number,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        trim: true,
        // required: true,
    },
    adminComment: [
        {
            commentedBy: {
                type: mongoose.Schema.ObjectId,
                ref: 'user'
            },
            commentText: {
                type: String,
                trim: true
            }
        } 
    ],

},{
    timestamps: true
})
   // create model 
 const feedbackModel = mongoose.model('feedback', feedbackSchema);
 export default feedbackModel;