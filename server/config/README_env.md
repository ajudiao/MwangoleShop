# .env — explicação linha a linha

Este README explica as variáveis de ambiente comuns usadas neste projeto. O arquivo `.env` normalmente fica na raiz do projeto e NÃO deve ser comitado no repositório (adicione `.env` ao `.gitignore`).

Exemplo de conteúdo (`.env`):

PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=uma_chave_secreta_para_tokens
ADMIN_EMAILS=admin@example.com,otheradmin@example.com
CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=seu_api_key_aqui
CLOUDINARY_API_SECRET=seu_api_secret_aqui

Linha-a-linha:

- `PORT`:
  - Porta em que o servidor irá rodar localmente. Se não definida, o código usa `5000` como padrão.

- `DATABASE_URL`:
  - URL de conexão com o banco de dados (Prisma usa essa variável comumente). Contém usuário, senha, host, porta e nome do DB.
  - Exemplo: `postgresql://user:password@localhost:5432/mwangole`.

- `JWT_SECRET`:
  - Chave secreta usada para assinar e verificar tokens JWT (usada em `auth` middleware e `authController`).
  - Deve ser longa e imprevisível.

- `ADMIN_EMAILS`:
  - Lista separada por vírgulas de emails que terão permissões de administrador no sistema.
  - O middleware `admin` verifica se o email do usuário está nessa lista.

- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`:
  - Credenciais para integrar com Cloudinary (uso em `config/cloudinary.ts`).

Boas práticas:
- Nunca compartilhe ou comite este arquivo.
- Em produção, defina essas variáveis no painel do provedor em vez de usar um arquivo `.env`.
- Altere `JWT_SECRET` regularmente se houver exposição.

Se quiser que eu gere o arquivo `.env.example` com placeholders, posso criar agora.