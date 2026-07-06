import express from 'express';
import auth from '../middleware/auth.js';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const uploadRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Store files in memory for processing
uploadRouter.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        const buffer = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = "data:" + req.file.mimetype + ";base64," + buffer;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'uploads',
            resource_type: 'auto',
        });
        
        // res.status(200).json({ message: 'File uploaded successfully', data: result });

        res.json({url: result.secure_url})

    } catch (error: any) {
        console.error("File Upload Error:", error);
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
});

export default uploadRouter;