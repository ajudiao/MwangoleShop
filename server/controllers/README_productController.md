# productController.ts — explicação linha a linha

Arquivo: `server/controllers/productController.ts` — handlers para operações de produto.

1. import { Request, Response } from 'express';
2. import { prisma } from "../config/prisma.js";
   - Importa tipos e Prisma.

4-33. export const getFlashDeals = async (req: Request, res: Response) => { ... }
   - Busca produtos com `stock > 0`, ordena por `originalPrice` e retorna os 8 primeiros.
   - Calcula `discount` percent (se `originalPrice` e `price` disponíveis) e retorna produtos com `discount`.

35-72. export async function getAllProducts(req: Request, res: Response) { ... }
   - Lê query params (`category`, `minPrice`, `maxPrice`, `search`, `sort`) e monta `where` e `orderBy` para `prisma.product.findMany`.
   - Retorna produtos com `discount` calculado.

74-98. export async function getProductById(req: Request, res: Response) { ... }
   - Busca produto por `id` e retorna `404` se não encontrado. Calcula `discount` e retorna o produto.

100-104. export async function createProduct(req: Request, res: Response) { const product = await prisma.product.create({ data: req.body }) return res.status(201).json({ product }); }
   - Cria um produto diretamente do `req.body` (considere validar campos antes).

106-115. updateProduct e deleteProduct: atualizam e deletam produto por `id`.

Notas e recomendações:
- Valide o `req.body` antes de criar/atualizar produtos (ex.: uso de `zod` ou `Joi`).
- Evite expor dados sensíveis; retorne somente os campos necessários.
- Trate erros com `try/catch` e use `next(err)` para o middleware de erro central.