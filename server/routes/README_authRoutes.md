# authRoutes.ts — explicação linha a linha

Arquivo: `server/routes/authRoutes.ts` — define rotas relacionadas à autenticação.

1. import express from "express"
   - Importa Express para criar um Router.

2. import { login, register } from "../controllers/authController.js"
   - Importa os handlers (controllers) que implementam a lógica de registro e login.

3. const authRouter = express.Router()
   - Cria um novo Router para agrupar rotas de autenticação.

4-5. authRouter.post("/register", register)
       authRouter.post("/login", login)
   - Define duas rotas POST: `/api/auth/register` e `/api/auth/login` (a base `/api/auth` é adicionada em `server.ts`).

6. export default authRouter
   - Exporta o router para ser usado em `server.ts`.

Observações:
- Os controllers tratam validação, hashing de senha, geração de token e resposta ao cliente.
- Validações extras podem ser adicionadas (por exemplo, checar formato do email antes de chamar o controller).