import Router from 'express';
import { uploadAudio, getAllAudio } from '../controllers/Audio.controller.js';
import { upload } from '../middlewares/Multer.middlewares.js';
import { verifyJWT } from '../middlewares/Auth.middlewares.js';

const router = Router();

// Route to upload audio
router.route('/upload').post(
    verifyJWT,
    upload.fields([
        {
            name: 'audio',
            maxCount: 1
        }
    ]),
    uploadAudio
);

// Route to get all audio files
router.route('/').get(getAllAudio);

export default router;
