# 📄 Página: Products.tsx

## O que é?
É a página de catálogo de produtos onde o usuário pode ver todos os produtos, filtrar por categoria, preço, e ordenar por diferentes critérios.

## Hooks e Estados - Explicação Detalhada

```tsx
const [searchParams, setSearchParams] = useSearchParams();
```
- **O que faz**: Lê os parâmetros da URL (ex: `?category=frutas&price=10`)
- **Por que**: Permite salvar filtros na URL (compartilhável, volta ao atualizar)

```tsx
const [products, setProducts] = useState<Product[]>([]);
```
- **O que faz**: Guarda lista de produtos a exibir

```tsx
const [totalPage, setTotalPage] = useState(1);
```
- **O que faz**: Guarda total de páginas para paginação

```tsx
const [loading, setLoading] = useState(true);
```
- **O que faz**: Indica se está carregando (mostra Loading.tsx enquanto carrega)

```tsx
const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
```
- **O que faz**: Controla se o painel de filtros está aberto no mobile

## Leitura dos Filtros da URL

```tsx
const category = searchParams.get("category") || "";
const organic = searchParams.get("organic") || "";
const sort = searchParams.get("sort") || "";
const page = Number(searchParams.get("page")) || 1;
const minPrice = searchParams.get("minPrice") || "";
const maxPrice = searchParams.get("maxPrice") || "";
```

**O que significa:**
- Busca o valor na URL com `searchParams.get("chave")`
- Se não existir, usa valor padrão (empty string ou 1)

**Exemplo prático:**
```
URL: /products?category=frutas&minPrice=10&maxPrice=50
category = "frutas"
minPrice = "10"
maxPrice = "50"
```

## Função de Buscar Produtos

```tsx
const fetchProducts = async () => {
    setLoading(true);
    setProducts(
        dummyProducts.filter((p) => p.category === category || category === ""),
    );
    setLoading(false);
};
```

**O que acontece:**
1. Marca como `loading = true` (mostra spinner)
2. Filtra produtos em tempo real (não faz requisição real ao servidor)
3. Se tem categoria selecionada, filtra por ela
4. Se `category === ""` (vazio), mostra todos
5. Marca como `loading = false` (esconde spinner)

**Explicação do filter:**
```tsx
dummyProducts.filter((p) => p.category === category || category === "")
```
- `p.category === category` → produto tem essa categoria?
- `|| category === ""` → OU a categoria está vazia (mostrar todos)

## Função de Atualizar Filtros

```tsx
const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    if (key !== "page") newParams.delete("page");
    setSearchParams(newParams);
};
```

**O que faz:**
1. Cria novo objeto de parâmetros
2. Se tem valor, adiciona à URL
3. Se não tem, remove da URL
4. Reseta página para 1 (se mudar filtro, volta à página 1)

**Exemplo:**
```tsx
// Usuário clica em "Frutas"
updateFilter("category", "frutas")
// URL muda para: /products?category=frutas
```

## Função de Limpar Filtros

```tsx
const clearFilters = () => setSearchParams({});
```
- Remove TODOS os filtros da URL
- URL volta para `/products`

## useEffect - O que Ativa Busca

```tsx
useEffect(() => {
    fetchProducts();
}, [category, organic, sort, page, minPrice, maxPrice]);
```

**O que significa:**
- Sempre que `category`, `organic`, `sort`, `page`, `minPrice` ou `maxPrice` **mudar**, execute `fetchProducts()`
- Isso permite buscar novos produtos quando filtros mudam

## Estrutura HTML

```tsx
<nav>Breadcrumb</nav>          {/* Navegação: Home / Produtos / Frutas */}

<aside>FilterPanel</aside>     {/* Barra lateral com filtros - desktop */}

<main>
  <header>                     {/* Título e quantidade */}
  <select>Sort</select>        {/* Ordenação */}
  <FilterPanel>                {/* Filtros mobile */}
  <div>ProductCard list</div>  {/* Grid de produtos */}
</main>
```

## Exemplo de Fluxo Completo

```
1. Usuário abre /products
   ↓
2. Vê todos os 50 produtos
   ↓
3. Clica em categoria "Frutas"
   ↓
4. updateFilter("category", "frutas") é chamado
   ↓
5. URL muda para /products?category=frutas
   ↓
6. useEffect detecta mudança em 'category'
   ↓
7. fetchProducts() é chamado
   ↓
8. Filtra produtos: só mostra os da categoria "frutas"
   ↓
9. Renderiza apenas produtos de frutas
```

## Por que usar URL params?

```
❌ Ruim - salvar em useState:
- Se user clica botão voltar, filtros desaparecem
- Não consegue compartilhar link com filtros

✅ Bom - salvar na URL:
- Filtros persistem ao voltar/atualizar página
- Pode compartilhar link: /products?category=frutas
- Um link pode abrir a página com filtros já aplicados
```

## Dicas Importantes

1. **useSearchParams** é do React Router (routing library)
2. **filter()** cria novo array, não modifica original
3. **Responsive design** - filtro diferente mobile vs desktop
4. **Loading state** - mostra spinner enquanto carrega
