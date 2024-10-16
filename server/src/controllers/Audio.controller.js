import { Audio } from '../models/Audio.model.js';
import uploadCloudinary from "../utils/Cloudinary.js"; // Adjust the path as necessary

// Upload audio and description
export const uploadAudio = async (req, res) => {
    try {
        const { description } = req.body;
        const audioFile = req.files.audio[0]; // Assuming audio is uploaded using multer

        // Upload audio to Cloudinary using the utility function
        const cloudinaryResponse = await uploadCloudinary(audioFile.path);

        if (!cloudinaryResponse) {
            return res.status(500).json({ message: 'Failed to upload audio to Cloudinary' });
        }

        // Create a new audio document with Cloudinary URL
        const newAudio = await Audio.create({
            user: req.user._id, // Get the user ID from the JWT
            audioFile: cloudinaryResponse.secure_url, // Store the Cloudinary URL
            description,
        });

        res.status(201).json({ message: 'Audio uploaded successfully', audio: newAudio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload audio', error });
    }
};

// Get all audio files
export const getAllAudio = async (req, res) => {
    try {
        const audioFiles = await Audio.find()
            .populate('user', 'username avatar'); // Populate username and avatar from User model
        res.status(200).json(audioFiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch audio files', error });
    }
};
