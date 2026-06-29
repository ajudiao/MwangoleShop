# prisma.ts — explicação linha a linha

Arquivo: `server/config/prisma.ts` — centraliza a instância do Prisma Client usada no projeto.

Conteúdo típico e explicação:

1. import { PrismaClient } from '@prisma/client'
   - Importa `PrismaClient`, a biblioteca gerada que fornece métodos para acessar o banco.

2. export const prisma = new PrismaClient();
   - Cria e exporta uma única instância do Prisma para ser reutilizada por todo o app.

3. (opcional) if (process.env.NODE_ENV === 'development') { prisma.$on('query', (e) => console.log('Query: ', e.query)) }
   - Em desenvolvimento, pode-se logar queries para debug.

Por que centralizar:
- Evita criar múltiplas instâncias do `PrismaClient` (o que poderia causar muitas conexões ao banco).
- Facilita mock e testes ao importar essa instância nos controllers e middlewares.