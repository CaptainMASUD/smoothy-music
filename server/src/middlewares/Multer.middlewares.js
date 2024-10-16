import fs from 'fs';
import multer from 'multer';
import path from 'path';





// Use process.cwd() to get the root directory of the project
const rootDir = process.cwd();
const tempDir = path.join(rootDir, 'public', 'temp');  // Create the folder in the root directory

// Ensure that the directory exists or create it
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer to store files in the 'public/temp' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);  // Store files in 'public/temp' in the root directory
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
