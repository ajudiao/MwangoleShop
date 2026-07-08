# MwangoleShop

MwangoleShop é uma aplicação de e-commerce moderna, construída para oferecer uma experiência completa de compra, desde a navegação pelos produtos até o checkout, rastreamento de pedidos e gestão de entregas.

## 🖼️ Preview do projeto

Imagem de demonstração da interface da plataforma:

![Preview da aplicação MwangoleShop](/client/src/assets/preview.png)

🌐 Visualização online: [MwangoleShop na Vercel](https://mwangole-shop.vercel.app/)

## ✨ Funcionalidades

- Catálogo de produtos com categorias e busca
- Carrinho de compras e checkout
- Gestão de endereços e pagamentos
- Histórico de encomendas e rastreamento
- Painel administrativo para gerir produtos, pedidos e parceiros de entrega
- Área dedicada para entregadores com atualização de status
- Autenticação e proteção de rotas

## 🛠️ Tecnologias utilizadas

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Stripe para pagamentos
- Cloudinary para uploads
- Nodemailer para emails

## 🚀 Como executar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/mwangoleshop.git
cd mwangoleshop
```

### 2. Instale as dependências

Frontend:
```bash
cd client
npm install
```

Backend:
```bash
cd ../server
npm install
```

### 3. Configure as variáveis de ambiente
No diretório server, crie um ficheiro .env com as variáveis necessárias, incluindo:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email
ADMIN_EMAILS=admin@example.com
```

### 4. Execute a aplicação

Frontend:
```bash
cd client
npm run dev
```

Backend:
```bash
cd server
npm run dev
```

A aplicação ficará disponível em:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Estrutura do projeto

```text
client/   # Interface web em React + Vite
server/   # API em Node.js + Express + Prisma
```

## 📌 Notas

Este projeto foi pensado como uma solução completa para um e-commerce com funcionalidades de gestão operacional, oferecendo uma experiência moderna tanto para clientes como para administradores e entregadores.

## 🤝 Contribuição

Contribuições são bem-vindas. Se quiser colaborar, abra uma issue ou envie um pull request.
