import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use Vercel's /tmp directory for file storage during runtime
const tempDir = '/tmp';  // Vercel allows writing only to /tmp

// Ensure that the /tmp directory exists or create it (typically not necessary, but just in case)
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer to store files in the /tmp directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);  // Store files in /tmp in Vercel environment
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
