# orderRoutes.ts — explicação linha a linha

Arquivo: `server/routes/orderRoutes.ts` — rotas relacionadas a pedidos.

1. import express from "express";
2. import auth from "../middleware/auth.js";
3. import { createOrder, getAllOrders, getOrder, getOrderLocation, getUserOrders, updateOrdersStatus } from "../controllers/orderController.js";
4. import admin from "../middleware/admin.js";
   - Importa dependências e handlers.

6. const orderRouter = express.Router()
   - Cria o Router.

8-13. orderRouter.post('/', auth, createOrder)
        orderRouter.get('/', auth, getUserOrders)
        orderRouter.get('/all', auth, admin, getAllOrders)
        orderRouter.get('/:id', auth, getOrder)
        orderRouter.put('/:id', auth, admin, updateOrdersStatus)
        orderRouter.get('/:id/location', auth, getOrderLocation)
   - Define rotas protegidas: criação de pedido, listagem do usuário, listagem completa (admin), detalhes do pedido, atualização de status (admin), e localização ao vivo.

15. export default orderRouter
   - Exporta o Router.

Notas:
- Valide o formato de `items` no body de `createOrder` para evitar dados inválidos.
- Considere usar transações ao criar pedidos e decrementar estoque para manter consistência.