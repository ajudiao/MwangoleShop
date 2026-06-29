# admin.ts — explicação linha a linha

Arquivo: `server/middleware/admin.ts` — middleware que verifica se um usuário é administrador.

1. import { NextFunction, Request, Response } from 'express';
   - Importa tipos do Express.

2. import { prisma } from '../config/prisma.js';
   - Importa a instância do Prisma para buscar dados do usuário.

3. const admin = async (req: Request, res: Response, next: NextFunction) => {
   - Define um middleware assíncrono para validação de admin.

4-6. const userId = req.user?.id; if (!userId) { return res.status(401).json({ message: 'Unauthorized' }); }
   - Verifica se `req.user` foi preenchido pelo middleware `auth`. Se não, retorna 401.

7-10. const user = await prisma.user.findUnique({ where: { id: userId } }); if (!user) { return res.status(404).json({ message: 'User not found' }); }
   - Busca o usuário no banco pelo `id`. Retorna 404 se não existir.

11-15. const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []; if (adminEmails.includes(user.email.toLocaleLowerCase())) { if(req.user) req.user.isAdmin = true; next(); } else { res.status(403).json({ message: 'Forbidden: Admins only' }); }
   - Lê `ADMIN_EMAILS` da env (lista de emails). Se o email do usuário estiver na lista, marca `req.user.isAdmin = true` e segue. Caso contrário, retorna 403.

17-20. catch (error) { console.error("Authorization Error:", error); return res.status(500).json({ message: 'Admin verfication failed', error: error.message }); }
   - Em caso de erro, loga e responde com 500.

Boas práticas:
- Certifique-se de que `ADMIN_EMAILS` esteja configurado adequadamente.
- Para permissões mais robustas, considere ter um campo `role` no modelo `User` em vez de depender apenas de uma lista de emails.
- Evite expor detalhes de erros em produção (não envie `error.message` no response).