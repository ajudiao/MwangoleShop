# 📄 Página: AppLayout.tsx

## O que é?
`AppLayout.tsx` é o **layout principal** da aplicação. É um container que envolve TODAS as páginas com navegação, header, footer e sidebar do carrinho. Não é uma página em si, mas um "moldura" que envolve as outras páginas.

## Estrutura

```tsx
export function AppLayout() {
    return (
        <>
            <Banner />
            <NavBar />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
            <CartSidebar />
        </>
    );
}
```

**O que cada coisa é:**

1. **`<Banner />`** - Banner no topo (promoções, avisos)
2. **`<NavBar />`** - Barra de navegação (logo, search, ícones)
3. **`<main>`** - Área principal onde as páginas são renderizadas
4. **`<Outlet />`** - PLACEHOLDER para as páginas específicas
5. **`<Footer />`** - Rodapé (links, informações)
6. **`<CartSidebar />`** - Sidebar do carrinho (abre quando clica no ícone)

## O que é `<Outlet />`?

`Outlet` é um componente do React Router que **marca o lugar onde as páginas aparecerão**.

**Analogi com HTML:**
```html
<!-- AppLayout é como um template -->
<html>
    <body>
        <header>Banner e NavBar aqui</header>
        
        <main>
            <!-- Outlet é AQUI -->
            <!-- Home.tsx, Products.tsx, etc aparecem aqui -->
        </main>
        
        <footer>Footer aqui</footer>
    </body>
</html>
```

## Routing - Como Funciona

**Arquivo de routing (deve estar em App.tsx ou main.tsx):**
```tsx
const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,  // Template principal
        children: [
            {
                path: "",            // /
                element: <Home />
            },
            {
                path: "products",    // /products
                element: <Products />
            },
            {
                path: "product/:id", // /product/123
                element: <ProductPage />
            },
            {
                path: "login",       // /login
                element: <Login />
            }
        ]
    }
]);
```

**Como funciona:**
```
Usuário acessa /
    ↓
React Router carrega AppLayout
    ↓
Vê que é "/" (home)
    ↓
Renderiza Home.tsx dentro de <Outlet />
    ↓
Resultado final:
    <Banner />
    <NavBar />
    <main>
        <Home />  ← aqui vai o conteúdo
    </main>
    <Footer />
    <CartSidebar />
```

```
Usuário clica "Produtos"
    ↓
URL muda para /products
    ↓
React Router carrega AppLayout de novo
    ↓
Vê que é "/products"
    ↓
Renderiza Products.tsx dentro de <Outlet />
    ↓
Resultado final:
    <Banner />
    <NavBar />
    <main>
        <Products />  ← agora é diferente
    </main>
    <Footer />
    <CartSidebar />
```

## Estrutura Visual

```
┌──────────────────────────────────┐
│         <Banner />               │
│ (Promoção: "Frete grátis")       │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ <NavBar />                       │
│ Logo | Search | Icons | Menu     │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│                                  │
│     <Outlet />                   │
│   (Página atual aqui)            │
│   Home, Products, etc            │
│                                  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ <Footer />                       │
│ Links | Contato | Redes Sociais  │
└──────────────────────────────────┘

     <CartSidebar />
     (Abre por cima quando necessário)
```

## Componentes Detalhados

### Banner
```tsx
<Banner />
```
- Aparece no topo de TODA página
- Usuário vê em Home, Products, etc
- Geralmente tem promoção ou aviso

### NavBar
```tsx
<NavBar />
```
- Barra de navegação no topo
- Tem:
  - Logo (clica volta pra home)
  - Search box (procura produtos)
  - Ícones (carrinho, perfil, etc)
  - Menu mobile

### Main com Outlet
```tsx
<main className="min-h-screen">
    <Outlet />
</main>
```

- `min-h-screen` - Altura mínima de uma tela inteira
- Garante que footer fica embaixo mesmo se conteúdo for pequeno
- `<Outlet />` é placeholder onde as páginas aparecem

### Footer
```tsx
<Footer />
```
- Aparece no final de TODA página
- Geralmente tem:
  - Links úteis
  - Informações da loja
  - Redes sociais
  - Copyright

### CartSidebar
```tsx
<CartSidebar />
```
- Sidebar que abre por cima do conteúdo
- Mostra itens do carrinho
- Permite fazer checkout

## Por que AppLayout?

**SEM AppLayout (❌ ruim):**
```tsx
function Home() {
    return (
        <>
            <Banner />
            <NavBar />
            <h1>Home</h1>
            <Footer />
            <CartSidebar />
        </>
    );
}

function Products() {
    return (
        <>
            <Banner />
            <NavBar />
            <h1>Products</h1>
            <Footer />
            <CartSidebar />
        </>
    );
}
```

❌ Repete Banner, NavBar, Footer em TODA página!

**COM AppLayout (✅ bom):**
```tsx
function AppLayout() {
    return (
        <>
            <Banner />
            <NavBar />
            <main>
                <Outlet />  {/* Home ou Products aqui */}
            </main>
            <Footer />
            <CartSidebar />
        </>
    );
}
```

✅ Uma vez só!

## Fluxo de Navegação Completa

```
Usuário abre o site (/)
    ↓
Carrega AppLayout
    ↓
Outlet renderiza Home
    ↓
┌──────────────────┐
│ Banner           │
│ NavBar           │
│ ┌──────────────┐ │
│ │ Home content │ │
│ └──────────────┘ │
│ Footer           │
│ CartSidebar      │
└──────────────────┘
    ↓
User clica "Produtos"
    ↓
URL muda para /products
    ↓
AppLayout NÃO remonta (já existe)
    ↓
Só o <Outlet /> muda de Home para Products
    ↓
┌──────────────────┐
│ Banner (mesmo)   │
│ NavBar (mesmo)   │
│ ┌──────────────┐ │
│ │Products cont.│ │ ← Só isso muda
│ └──────────────┘ │
│ Footer (mesmo)   │
│ CartSidebar      │
└──────────────────┘
```

## Dicas Importantes

1. **AppLayout é um "template"** - envolve todas as páginas
2. **`<Outlet />`** - marca o lugar onde páginas vão aparecer
3. **Só Outlet muda** - Banner, NavBar, Footer permanecem iguais
4. **Responsivo** - Tudo muda tamanho conforme tela
5. **CartSidebar fica por cima** - Não empurra conteúdo
6. **Em React Router v6** - AppLayout é parent route, outras são children
