# authController.ts — explicação linha a linha

Arquivo: `server/controllers/authController.ts` — lógica de registro e login.

1-3. import { Request, Response } from "express"; import { prisma } from "../config/prisma.js"; import bcrypt from "bcrypt"
   - Importa tipos, acesso ao DB (Prisma) e `bcrypt` para hash de senhas.

4. import jwt from "jsonwebtoken";
   - Importa JWT para gerar tokens.

6-9. const generateToken = (id: string) => { return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "30d" }) }
   - Gera um token JWT com o ID do usuário e expiração.

11-17. const getAdminStatus = (email: string | null | undefined): boolean => { ... }
   - Verifica se o email está na lista `ADMIN_EMAILS` das variáveis de ambiente e retorna `true/false`.

19-49. export const register = async (req: Request, res: Response) => { ... }
   - Valida `name`, `email`, `password`.
   - Verifica se o usuário já existe (email lowercase).
   - Hashea a senha com `bcrypt.hash(password, 10)` e cria o usuário no DB.
   - Gera token, remove a senha do objeto retornado e adiciona `isAdmin` antes de enviar resposta 201.

51-79. export const login = async (req: Request, res: Response) => { ... }
   - Valida `email` e `password`.
   - Busca usuário pelo email e compara a senha com `bcrypt.compare`.
   - Se ok, gera token, remove senha e adiciona `isAdmin` antes de responder 200.

Notas:
- Nunca retorne a senha no response (o código remove `password`).
- Para segurança, limite tentativas de login (rate limiting) e considere usar `helmet`/outras hardening middlewares.
- Validações de formato (email, força da senha) podem ser adicionadas antes de acessar o DB.