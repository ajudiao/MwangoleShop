# auth.ts — explicação linha a linha

Arquivo: `server/middleware/auth.ts` — middleware de autenticação usando JWT.

1. import { NextFunction, Request, Response } from 'express';
   - Importa tipos do Express para tipar os parâmetros do middleware.

2. import jwt from 'jsonwebtoken';
   - Importa a biblioteca para verificar e decodificar tokens JWT.

3. const auth = (req: Request, res: Response, next: NextFunction) => {
   - Define o middleware `auth` que será usado para proteger rotas.

4-7. const authHeader = req.headers.authorization; if (!authHeader || !authHeader.startsWith('Bearer ')) { return res.status(401).json({ message: 'No token provided, authorization denied' }); }
   - Lê o header `Authorization` e valida o formato `Bearer <token>`. Se ausente ou inválido, retorna 401.

8-11. const token = authHeader.split(' ')[1]; const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
   - Extrai o token (parte depois de `Bearer `) e usa `jwt.verify` com a chave `JWT_SECRET` para validar e obter o payload.

12. req.user = { id: decoded.id };
   - Armazena o `id` do usuário em `req.user` para uso posterior em controllers.

13. next();
   - Chama o próximo middleware/handler se tudo estiver ok.

14-18. catch (error) { console.error("Authorization Error:", error); return res.status(401).json({ message: 'Token is not valid' }); }
   - Em caso de erro (token expirado, inválido), loga o erro e retorna 401.

Boas práticas e notas:
- Tenha certeza de que `JWT_SECRET` está definida nas variáveis de ambiente.
- Para handlers assíncronos, capture erros e passe para `next(err)` quando apropriado.
- Este middleware apenas verifica o token e popula `req.user`. A verificação de permissões (admin) é feita em outro middleware (`admin`).