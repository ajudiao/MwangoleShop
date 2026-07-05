# 📄 Página: FlashDeals.tsx

## O que é?
É a página de "Ofertas Relâmpago" - produtos com estoque disponível. Mostra uma grid de produtos que estão à venda por tempo limitado.

## Estados

```tsx
const [products, setProducts] = useState<Product[]>([]);
```
- Guarda lista de produtos em oferta

```tsx
const [loading, setLoading] = useState(true);
```
- Indica se está carregando

## useEffect - Buscar Produtos

```tsx
useEffect(() => {
    setProducts(dummyProducts.filter((p: any) => p.stock > 0));
    setTimeout(() => setLoading(false), 1000);
}, []);
```

**O que faz:**

1. **Filtra produtos**
   ```tsx
   dummyProducts.filter((p: any) => p.stock > 0)
   ```
   - Pega só produtos que têm estoque (stock > 0)
   - Remove produtos esgotados

2. **Simula carregamento**
   ```tsx
   setTimeout(() => setLoading(false), 1000)
   ```
   - Aguarda 1 segundo
   - Depois marca como não carregando
   - Faz parecer que está buscando dados

3. **Dependency array vazio**
   ```tsx
   }, [])
   ```
   - Executa só UMA VEZ quando página carrega
   - Não executa de novo mesmo se re-renderizar

## Banner Superior

```tsx
<div className="bg-linear-to-r from-app-orange to-app-orange-dark text-white py-10">
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-6 text-center">
        <div className="flex-center gap-2 mb-3">
            <Zap className="size-6 fill-white" />
            <h1 className="text-3xl font-semibold">Ofertas Relâmpago</h1>
            <Zap className="size-6 fill-white" />
        </div>

        <p className="text-white/80 max-w-md mx-auto">
            Ofertas por tempo limitado nos seus produtos orgânicos favoritos. Aproveite antes que acabem!
        </p>
    </div>
</div>
```

**O que tem:**

1. **Gradiente de cor**
   ```tsx
   className="bg-linear-to-r from-app-orange to-app-orange-dark"
   ```
   - Gradiente do laranja claro para escuro (da esquerda pra direita)

2. **Ícones de relâmpago**
   ```tsx
   <Zap className="size-6 fill-white" />
   ```
   - Ícone de relâmpago preenchido de branco
   - Um de cada lado do título

3. **Descrição**
   ```tsx
   <p className="text-white/80 max-w-md mx-auto">
   ```
   - `text-white/80` = branco com 80% opacidade (semi-transparente)
   - `max-w-md` = largura máxima

## Renderização Condicional

```tsx
{loading ? (
    <Loading />
) : (
    products.length === 0 ? (
        <div className="text-center py-16">
            <Zap className="size-16 text-app-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-app-green mb-2">No deals rigth now</h2>
            <p className="text-sm text-app-text-light">Check back sonn for amazing offers</p>
        </div>
    ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => product.stock > 0 && (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
)}
```

**Fluxo de decisão:**

```
┌─────────────────────────────────┐
│ Está loading?                   │
├─────────────────────────────────┤
│ SIM → Mostra <Loading />        │
│ NÃO ↓                           │
│     Tem produtos?               │
│     SIM → Mostra grid           │
│     NÃO → Mostra "sem ofertas"  │
└─────────────────────────────────┘
```

### 1. Carregando
```tsx
{loading ? (
    <Loading />
```
- Mostra spinner

### 2. Sem ofertas
```tsx
) : (
    products.length === 0 ? (
        <div className="text-center py-16">
            <Zap className="size-16 text-app-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-app-green mb-2">
                No deals rigth now
            </h2>
            <p className="text-sm text-app-text-light">
                Check back sonn for amazing offers
            </p>
        </div>
```

**Mostra:**
- Grande ícone de relâmpago (size-16 = 64px)
- Mensagem "sem ofertas agora"
- Texto de incentivo

### 3. Com ofertas
```tsx
    ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => product.stock > 0 && (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
```

**Grid responsivo:**
- `grid-cols-2` - Mobile: 2 colunas
- `sm:grid-cols-3` - Tablet: 3 colunas
- `md:grid-cols-4` - Desktop: 4 colunas
- `xl:grid-cols-5` - Desktop grande: 5 colunas

**Mapeamento:**
```tsx
products.map((product) => product.stock > 0 && (
    <ProductCard key={product.id} product={product} />
))
```

- Loop em cada produto
- Só renderiza se `stock > 0`
- Passa produto como prop para `ProductCard`
- `key` é obrigatório em listas (React usa para identificar)

## Estrutura Completa

```
┌────────────────────────────────┐
│ Banner com "Ofertas Relâmpago"  │
└────────────────────────────────┘
        ↓
┌────────────────────────────────┐
│ Loading?                        │
│   SIM → spinner                 │
│   NÃO ↓                         │
├────────────────────────────────┤
│ Tem produtos?                   │
│   SIM → Grid de produtos        │
│   NÃO → "Sem ofertas agora"     │
└────────────────────────────────┘
```

## Fluxo Completo

```
1. User clica em "Ofertas Relâmpago"
   ↓
2. FlashDeals renderiza
   ↓
3. Mostra banner laranja com título
   ↓
4. Começa a carregar (loading = true)
   ↓
5. useEffect executa:
   - Filtra produtos com stock > 0
   - Aguarda 1 segundo
   - setLoading(false)
   ↓
6. Renderiza grid de produtos
   ↓
7. User clica em um produto
   ↓
8. Navega para ProductPage.tsx com ID
```

## Por que useEffect com dependency vazio?

```tsx
useEffect(() => {
    // código aqui
}, []);  // ← Vazio = executa UMA VEZ ao montar
```

**Se tivesse dependências:**
```tsx
useEffect(() => {
    // executa toda vez que dependência muda
}, [products, loading]);
```

**Sem dependências (vazio):**
```tsx
useEffect(() => {
    // executa só uma vez quando componente monta
}, []);
```

Neste caso, queremos só uma vez porque dados não mudam depois (dados fake).

## Dicas Importantes

1. **`filter()` cria novo array** - original não é modificado
2. **`stock > 0`** - Verifica se tem estoque
3. **Grid responsivo com Tailwind** - Muda colunas conforme tela
4. **`key={product.id}`** é OBRIGATÓRIO em listas
5. **`loading ? X : Y`** é ternário (if/else em uma linha)
6. **`size-16`** = 64px (tamanho em Tailwind)
