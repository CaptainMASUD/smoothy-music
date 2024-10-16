import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure that the directory exists or create it
const tempDir = path.join(__dirname, 'public', 'temp');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer to store files in the 'public/temp' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);  // Store files in 'public/temp'
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  // Use the original filename
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }  // 100MB limit
});

export { upload };
