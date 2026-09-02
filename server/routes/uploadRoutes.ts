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
            return res.status(400).json({ message: 'Nenhum arquivo de imagem fornecido' });
        }
        
        const buffer = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = "data:" + req.file.mimetype + ";base64," + buffer;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'uploads',
            resource_type: 'auto',
        });
        
        res.json({url: result.secure_url})

    } catch (error: any) {
        console.error("Erro de Upload de Arquivo:", error);
        const cloudinaryError = error?.error?.message || error?.message || 'Erro desconhecido';
        res.status(500).json({
            message: 'Falha ao fazer upload do arquivo',
            error: cloudinaryError,
        });
    }
});

export default uploadRouter;