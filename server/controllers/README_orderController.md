# orderController.ts — explicação linha a linha

Arquivo: `server/controllers/orderController.ts` — lógica de criação e consulta de pedidos.

1-2. import { Request, Response } from 'express'; import { prisma } from '../config/prisma.js';
   - Importa tipos e instancia do Prisma.

CreateOrder (linhas principais):
- Valida `items` no body.
- Lê `productId` de cada item e busca os produtos no DB para garantir preços/estoque reais.
- Constrói `orderItems` com dados do DB (nome, imagem, preço, unidade) para evitar manipulação pelo cliente.
- Calcula `subtotal`, `deliveryFee`, `tax` e `total`.
- Cria o `order` no DB com `statusHistory` inicial.
- Retorna o pedido e depois decrementa o estoque de cada produto.

GetUserOrders:
- Busca pedidos do usuário (`userId` em `req.user`) e filtra pagamentos pendentes de cartão.

GetOrder:
- Busca um pedido pelo `id` e `userId` para garantir que o usuário só veja seus próprios pedidos.

UpdateOrdersStatus:
- Atualiza status do pedido (admin) adicionando uma entrada em `statusHistory`.

GetAllOrders:
- Lista todos os pedidos (exceto cartões pendentes) para visão administrativa.

GetOrderLocation:
- Retorna `liveLocation` e `status` do pedido.

Boas práticas recomendadas:
- Use `prisma.$transaction` para criar o pedido e decrementar estoque atomically.
- Trate erros com `try/catch` e utilize o middleware de erro (`next(err)`).
- Valide formatos e tipos dos `items` antes de operar no DB.