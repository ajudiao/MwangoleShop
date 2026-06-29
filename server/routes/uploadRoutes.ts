import express from 'express';
import { prisma } from '../config/prisma.js';
import auth from '../middleware/auth.js';
import multer from 'multer';

const uploadRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Store files in memory for processing
uploadRouter.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        
    } catch (error) {
        console.error("File Upload Error:", error);
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
});

export default uploadRouter;