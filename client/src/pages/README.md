# 📚 Guia Completo das Páginas - MwangoleShop

Bem-vindo! Este é um guia em português para entender **cada página** do seu projeto React. Você é iniciante e quer entender a lógica, não apenas copiar código. Perfeito! Aqui explicamos:

- ✅ O que cada página faz
- ✅ Como os hooks funcionam
- ✅ Por que o código é assim
- ✅ Fluxos completos com exemplos

## 📑 Índice de Páginas

### 🏠 [Home.tsx](README_HOME.md)
**A primeira página que o usuário vê**

- Página inicial com seções (Hero, Categorias, Produtos Populares)
- Composição de componentes simples
- Sem estados complexos (só monta componentes)
- Responsivo com Tailwind

**Conceitos:** Composição, componentes reutilizáveis, layout responsivo

---

### 🛍️ [Products.tsx](README_PRODUCTS.md)
**Catálogo de produtos com filtros**

- Filtrar por categoria, preço, etc
- Parâmetros na URL (searchParams)
- Estado local com useState
- useEffect para atualizar quando filtro muda
- Grid responsivo de produtos

**Conceitos:** useState, useEffect, useSearchParams, filter(), ternários

---

### 📦 [ProductPage.tsx](README_PRODUCTPAGE.md)
**Detalhes de um produto específico**

- Pegar ID da URL com useParams
- Buscar produto individual
- Controlar quantidade antes de comprar
- Adicionar ao carrinho
- Mostrar produtos relacionados

**Conceitos:** useParams, find(), carrinho (CartContext), condicional renderização

---

### 🔐 [Login.tsx](README_LOGIN.md)
**Login e registro de usuário**

- Toggle entre login e registro
- Campos controlados (controlled inputs)
- Form com validação
- Simula requisição ao servidor
- Responsivo (lado direito desktop, centralizado mobile)

**Conceitos:** useState, form handling, condicional renderização, preventDefault

---

### 📦 [MyOrders.tsx](README_MYORDERS.md)
**Histórico de pedidos do usuário**

- Lista todos os pedidos
- Filtro por status (abas)
- Mostra fotos, quantidade, total
- Clica para ver detalhes
- Limpa carrinho após checkout

**Conceitos:** map(), filter(), aba selecionada, Link para navegação, dados fake

---

### 🚚 [OrderTracking.tsx](README_ORDERTRACKING.md)
**Rastreamento em tempo real do pedido**

- Mostra status do pedido
- Mapa ao vivo (LiveMap)
- Timeline de eventos
- Dados do entregador
- Endereço de entrega
- Grid em 3 colunas (2 + 1)

**Conceitos:** useParams, layout grid responsivo, componentes child, dados fake

---

### ⚡ [FlashDeals.tsx](README_FLASHDEALS.md)
**Ofertas relâmpago (tempo limitado)**

- Produtos com estoque disponível
- Banner laranja atrativo
- Grid responsivo (2-5 colunas conforme tela)
- Loading state
- Mensagem quando sem ofertas

**Conceitos:** useEffect, filter(), grid responsivo, loading state, ternários

---

### 🎨 [AppLayout.tsx](README_APPLAYOUT.md)
**Layout principal (moldura de todas as páginas)**

- Banner no topo
- NavBar com navegação
- Outlet para as páginas (Home, Products, etc)
- Footer
- CartSidebar

**Conceitos:** React Router, Outlet, layout template, componentes que envolve

---

## 🚫 Páginas Vazias (Não Documentadas)

Estas páginas ainda não têm conteúdo:
- `Addresses.tsx` - Gerenciar endereços (não implementada)
- `Checkout.tsx` - Processo de checkout (não implementada)
- `SearchResult.tsx` - Resultados da busca (não implementada)
- `Deals.tsx` - Promoções gerais (não implementada)

---

## 📊 Fluxo Geral da Aplicação

```
Usuário abre site (/)
    ↓
AppLayout carrega (moldura)
    ↓
Home renderiza
    ↓
User clica em categoria → Products com filtro
    ↓
User clica em produto → ProductPage
    ↓
User clica "+" → Adiciona ao carrinho (CartContext)
    ↓
User clica carrinho → CartSidebar abre
    ↓
User clica checkout → Checkout.tsx (não implementada)
    ↓
User redireciona → MyOrders (histórico)
    ↓
User clica em pedido → OrderTracking (rastreamento)
```

---

## 🎓 Conceitos Aprendidos

### Por Página

| Página | Conceitos Principais |
|--------|----------------------|
| Home | Composição, Tailwind |
| Products | useState, useEffect, useSearchParams, filter() |
| ProductPage | useParams, find(), CartContext, condicional |
| Login | Form handling, toggle state, preventDefault |
| MyOrders | map(), filter(), aba selecionada, Link |
| OrderTracking | useParams, grid layout, optional chaining |
| FlashDeals | useEffect, filter(), loading state |
| AppLayout | React Router, Outlet, layout template |

### Técnicas Importantes

```
useState            - Guardar dados na página
useEffect           - Executar código quando algo muda
useParams           - Ler ID da URL
useSearchParams     - Ler filtros da URL
useNavigate         - Navegar entre páginas
useCart             - Acessar carrinho global (Context)
find()              - Procurar 1 item em array
filter()            - Procurar vários itens
map()               - Criar novo array transformado
Ternário (? :)      - If/else em uma linha
Condicional (&&)    - Mostrar algo se verdadeiro
Link                - Navegar em HTML
optional chaining   - Seguro acessar objeto que pode null
```

---

## 💡 Dicas de Aprendizado

1. **Leia na ordem:** Home → Products → ProductPage → Login → MyOrders → OrderTracking
   - Assim aprende fundações antes de coisas complexas

2. **Execute o código:** Abra cada página no navegador e veja funcionando
   - Entender visualmente ajuda muito

3. **Modifique o código:** Tente mudar cores, textos, layouts
   - Aprender fazendo é melhor que só ler

4. **Abra o DevTools (F12):** Veja os elementos HTML
   - Entenda como React renderiza

5. **Debug com console.log():** Adicione prints para ver valores
   - Muito útil para aprender

6. **Use a documentação:** Vá para o [React Docs](https://react.dev)
   - Quando tiver dúvidas, procure lá

---

## 🔗 Próximos Passos

Depois de entender as páginas:

1. **Estude os componentes** (`src/components/`)
   - Cada componente reutilizável
   - Que props recebem
   - Como renderizam

2. **Estude o CartContext** (`src/contexts/CartContext.tsx`)
   - Como compartilhar dados entre páginas
   - useState com Context API

3. **Estude o routing** (provavelmente em App.tsx ou main.tsx)
   - Como React Router funciona
   - Como as páginas são carregadas

4. **Implemente as páginas vazias**
   - Checkout, Addresses, SearchResult, Deals
   - Usa os mesmos padrões que aprendeu

5. **Conecte ao backend real**
   - Troque dados fake por API real
   - Use fetch() ou axios
   - Lide com erros

---

## ❓ Perguntas Comuns

### Por que usar useState em vez de variável normal?
```tsx
❌ let count = 0;          // Não funciona! Não renderiza
✅ const [count, setCount] = useState(0);  // Funciona! Renderiza quando muda
```

### Por que useEffect?
```tsx
❌ Sem useEffect:
fetch('/api/products')  // Executa toda renderização! Infinito!

✅ Com useEffect:
useEffect(() => {
    fetch('/api/products')
}, [])  // Executa só UMA VEZ ao montar
```

### Por que Link em vez de <a href>?
```tsx
❌ <a href="/products">  // Recarrega página (perde estado!)

✅ <Link to="/products">  // Navega sem recarregar (mantém estado!)
```

### Por que useParams?
```tsx
// URL: /product/123
❌ const id = window.location.href  // Pega URL inteira (bagunçado)
✅ const { id } = useParams()       // Pega só o ID (limpo)
```

---

## 📝 Resumo

Você tem um projeto e-commerce estruturado com:
- ✅ 8 páginas funcionais
- ✅ Componentes reutilizáveis
- ✅ Gerenciamento de estado (useState, Context)
- ✅ Roteamento (React Router)
- ✅ Responsivo (Tailwind CSS)
- ✅ Dados fake (preparado para real)

**Seu objetivo:** Entender COMO e POR QUÊ cada coisa é assim, não copiar cegamente.

**Comece lendo:** [Home.tsx](README_HOME.md)

Boa sorte! 🚀
