import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"; // Import path module

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided.");
            return null;
        }

        localFilePath = path.resolve(localFilePath); // Convert to absolute path

        // Check if the file exists before attempting to upload
        if (!fs.existsSync(localFilePath)) {
            console.error(`File not found: ${localFilePath}`);
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // Attempt to remove the locally saved temporary file after successful upload
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                console.log(`File uploaded successfully and deleted: ${localFilePath}`);
            } else {
                console.error(`File not found for deletion: ${localFilePath}`);
            }
        } catch (unlinkError) {
            console.error(`Error deleting file: ${unlinkError.message}`);
        }

        return response;

    } catch (error) {
        console.error(`Error uploading to Cloudinary: ${error.message}`);

        // Attempt to remove the local file if an error occurred
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                console.log(`File deleted due to error: ${localFilePath}`);
            } else {
                console.error(`File not found during error handling: ${localFilePath}`);
            }
        } catch (unlinkError) {
            console.error(`Error deleting file during error handling: ${unlinkError.message}`);
        }

        return null;
    }
};

export default uploadCloudinary;
