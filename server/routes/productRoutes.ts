import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFlashDeals, getProductById, updateProduct } from '../controllers/productController.js';

import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const productRouter = express.Router();

productRouter.get('/flash-deals', getFlashDeals);
productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', auth, admin, createProduct);
productRouter.put('/:id', auth, admin, updateProduct);
productRouter.delete('/:id', auth, admin, deleteProduct);


export default productRouter;