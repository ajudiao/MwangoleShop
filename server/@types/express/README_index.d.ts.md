# @types/express/index.d.ts — explicação linha a linha

Este arquivo adiciona tipos TypeScript customizados para a extensão do objeto `Request` do Express (por exemplo `req.user`).

Linhas típicas e significado:

1. declare global {
2.   namespace Express {
3.     interface Request {
4.       user?: { id: string; isAdmin?: boolean }
5.     }
6.   }
7. }

- `declare global` abre o escopo global de tipos para que a extensão seja visível em todo o projeto.
- `namespace Express` faz referência ao namespace de tipos do Express.
- `interface Request` adiciona a propriedade `user` ao tipo `Request`, usada pelo middleware de autenticação para armazenar `id` e `isAdmin`.

Por que isto é útil:
- Evita o uso de `any` e `// @ts-ignore` quando você acessa `req.user` em controllers e middlewares.
- Melhora autocompletar e checagem de tipos durante desenvolvimento.