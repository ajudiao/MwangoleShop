# productRoutes.ts — explicação linha a linha

Arquivo: `server/routes/productRoutes.ts` — define rotas para produtos.

1. import express from 'express';
   - Importa Express para criar o Router.

2. import { createProduct, deleteProduct, getAllProducts, getFlashDeals, getProductById, updateProduct } from '../controllers/productController.js';
   - Importa os handlers que contêm a lógica de cada rota.

3. import auth from '../middleware/auth.js';
   - Middleware que exige autenticação.

4. import admin from '../middleware/admin.js';
   - Middleware que exige privilegios de administrador.

5. const productRouter = express.Router();
   - Cria o Router.

6-11. productRouter.get('/flash-deals', getFlashDeals);
        productRouter.get('/', getAllProducts);
        productRouter.get('/:id', getProductById);
        productRouter.post('/', auth, admin, createProduct);
        productRouter.put('/:id', auth, admin, updateProduct);
        productRouter.delete('/:id', auth, admin, deleteProduct);
   - Define rotas públicas (`GET`) e rotas protegidas que requerem `auth` e `admin` para criação, atualização e deleção.

12. export default productRouter;
   - Exporta o Router.

Notas:
- Parâmetros como `:id` aparecem em `req.params.id` nos controllers.
- Mantenha validação de entrada (body) nos controllers para evitar dados inválidos no DB.