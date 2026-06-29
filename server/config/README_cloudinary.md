# cloudinary.ts — explicação linha a linha

Este arquivo configura e exporta a instância do Cloudinary usada para upload de imagens.

Linha a linha:

1. import { v2 as cloudinary } from 'cloudinary'
   - Importa a versão 2 da biblioteca `cloudinary` e a renomeia para `cloudinary`.
   - A biblioteca fornece métodos para fazer upload, deletar e gerenciar arquivos no serviço Cloudinary.

2. 
   cloudinary.config({
       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
       api_key: process.env.CLOUDINARY_API_KEY,
       api_secret: process.env.CLOUDINARY_API_SECRET,
       secure: true,
   });
   - Chama `config` para configurar a instância do Cloudinary com as credenciais.
   - `cloud_name`, `api_key`, `api_secret` são carregados das variáveis de ambiente (`process.env`).
   - `secure: true` força URLs HTTPS para os recursos retornados.

   Observações para iniciantes:
   - Nunca coloque `api_key` ou `api_secret` diretamente no código. Use um arquivo `.env` ou variáveis de ambiente.
   - Essas variáveis normalmente são definidas num arquivo chamado `.env` na raiz do projeto, por exemplo:

     CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
     CLOUDINARY_API_KEY=seu_api_key_aqui
     CLOUDINARY_API_SECRET=seu_api_secret_aqui

   - Quando o servidor roda, `process.env` lê essas variáveis e as passa para a configuração.

3. export default cloudinary;
   - Exporta a instância configurada do Cloudinary para ser usada em outros pontos do servidor (por exemplo, rota de upload).

Como usar:
- Em um arquivo de rota (ex.: `uploadRoutes.ts`) você faz:
  ```ts
  import cloudinary from '../config/cloudinary.js'
  // então usa cloudinary.uploader.upload(...) para enviar imagens
  ```

Segurança e boas práticas:
- Mantenha as credenciais fora do repositório (adicione `.env` ao `.gitignore`).
- Para produção, use variáveis de ambiente do provedor (Heroku, Vercel, AWS) em vez de arquivos `.env` locais.
- Considere limitar permissões e rotas que podem acessar uploads (autenticação).