import mongoose from 'mongoose';

const AudioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    audioFile: {
        type: String, // Store the Cloudinary URL for the audio
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Audio = mongoose.model('Audio', AudioSchema);
