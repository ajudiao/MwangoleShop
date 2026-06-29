# uploadRoutes.ts — explicação linha a linha

Arquivo: `server/routes/uploadRoutes.ts` — rota para upload de imagens usando `multer` e `cloudinary`.

1. import express from 'express';
2. import { prisma } from '../config/prisma.js';
3. import auth from '../middleware/auth.js';
4. import multer from 'multer';
5. import cloudinary from '../config/cloudinary.js';
   - Importa dependências: servidor, banco (caso precise guardar metadados), middleware de auth, `multer` para aceitar arquivos e `cloudinary` para upload.

7-8. const uploadRouter = express.Router(); const storage = multer.memoryStorage(); const upload = multer({ storage: storage });
   - Configura `multer` para armazenar arquivos em memória (buffer) para posterior envio ao Cloudinary.

11-31. uploadRouter.post('/', auth, upload.single('image'), async (req, res) => { ... })
   - Rota POST protegida por `auth` que espera um arquivo `image` no form-data.
   - Verifica se `req.file` existe, converte para base64 e chama `cloudinary.uploader.upload` com `dataURI`.
   - Retorna `result.secure_url` para o cliente se bem-sucedido.
   - Em caso de erro, responde 500 e loga a falha.

33. export default uploadRouter;
   - Exporta o router.

Notas:
- `memoryStorage` é prático para uploads curtos, mas cuidado com arquivos muito grandes pois consome memória do servidor.
- Em produção, limite tamanho e tipo de arquivo, e valide/filtre uploads.
- Armazene apenas URLs/metadata no DB, não o binário inteiro.