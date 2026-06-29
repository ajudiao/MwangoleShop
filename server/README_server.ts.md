# server.ts — explicação linha a linha

Este arquivo é o ponto de entrada do servidor Express.

1. import "dotenv/config";
   - Carrega automaticamente as variáveis de ambiente do arquivo `.env` no `process.env`.

2. import express, { NextFunction, Request, Response } from 'express';
   - Importa o framework Express e tipos TypeScript para requisições/respostas.

3. import cors from "cors";
   - Importa o middleware `cors` para permitir requisições entre origens (cross-origin).

4-7. import authRouter from "./routes/authRoutes.js"; etc.
   - Importa os routers que agrupam rotas relacionadas (autenticação, produtos, upload, pedidos).

9. const app = express();
   - Cria a instância do servidor Express.

12-13. app.use(cors())
        app.use(express.json());
   - Registra middlewares globais: `cors()` para CORS e `express.json()` para parsear JSON no corpo da requisição.

15. const port = process.env.PORT || 5000;
   - Lê a porta da variável de ambiente `PORT`. Se não definida, usa `5000`.

17-19. app.get('/', (req, res) => { res.send('Server is Live!'); });
   - Rota raiz de teste que retorna uma mensagem simples.

21-24. app.use("/api/auth", authRouter); etc.
   - Registra os routers nas paths base. Ex.: `/api/products` todas as rotas de produto.

26-31. app.use((err, req, res, next) => { console.error(err.stack); res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' }); });
   - Middleware central de tratamento de erros. Recebe erros vindos das rotas (via `next(err)`), loga e responde com status apropriado.

33-36. app.listen(port, () => { console.log(`Server is running at http://localhost:${port}`); });
   - Inicia o servidor na porta definida e escreve uma mensagem no console.

Conselhos práticos:
- Use `next(err)` dentro de handlers async (ou wrapper) para garantir que o middleware de erro central trate as exceções.
- Mantenha a configuração de rota consistente (plural/minúsculo) para evitar 404.
- Para desenvolvimento, utilize `nodemon` para reiniciar automaticamente ao alterar arquivos.