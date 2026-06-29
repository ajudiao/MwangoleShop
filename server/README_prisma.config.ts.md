# prisma.config.ts — explicação linha a linha

Este arquivo configura (se presente) opções relacionadas ao Prisma ou exporta a configuração gerada.

(Nota: o projeto também tem um diretório `generated/prisma` — esse conteúdo é gerado pelo Prisma Client e normalmente não é editado manualmente.)

Exemplo comum de conteúdo e explicação:

1. import { PrismaClient } from '@prisma/client'
   - Importa a classe `PrismaClient` que fornece métodos para acessar o banco de dados.

2. export const prisma = new PrismaClient();
   - Cria e exporta uma instância do cliente Prisma para ser usada em outros módulos (controllers, middlewares).

3. (opcional) prisma.$connect() / prisma.$disconnect()
   - Métodos para conectar/desconectar do banco. Normalmente o `PrismaClient` conecta automaticamente quando necessário.

Se o arquivo `prisma.config.ts` neste projeto contém conteúdo diferente, este README descreve a finalidade geral: centralizar a instância do Prisma para evitar múltiplas conexões e facilitar testes e mocks.