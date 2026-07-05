# 📄 Página: ProductPage.tsx

## O que é?
É a página de detalhes de um produto específico. Mostra foto, descrição, preço, avaliações e permite adicionar à compra (carrinho).

## Hooks e Estados

```tsx
const { id } = useParams();
```
- **O que faz**: Pega o ID do produto da URL
- **Exemplo**: `/product/123` → `id = "123"`

```tsx
const navigate = useNavigate();
```
- **O que faz**: Permite navegar para outras páginas programaticamente
- **Exemplo**: `navigate("/products")` volta para produtos

```tsx
const { items, addToCart, updateQuantity, removeFromCart } = useCart();
```
- **O que faz**: Pega funções do contexto do carrinho
- **Explicação**: CartContext.tsx centraliza tudo sobre carrinho

```tsx
const [product, setProduct] = useState<Product | null>(null);
const [loading, setLoading] = useState(true);
const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
const [localQuantity, setLocalQuantity] = useState(1);
```

- `product` - produto sendo visualizado
- `loading` - indica se está carregando
- `relatedProducts` - produtos similares (outros da mesma categoria)
- `localQuantity` - quantidade antes de adicionar ao carrinho

## Hook useEffect - Carrega Produto

```tsx
useEffect(() => {
    setLoading(true);
    setLocalQuantity(1);
    window.scrollTo(0, 0);
    const product = dummyProducts.find((p) => p.id === id);
    setProduct(product!);
    setRelatedProducts(dummyProducts.filter((p) => p.id !== id));
    setLoading(false);
}, [id, navigate]);
```

**O que cada linha faz:**

```tsx
setLoading(true);           // Começa a carregar
setLocalQuantity(1);        // Reseta quantidade para 1
window.scrollTo(0, 0);      // Sobe a página ao topo
```

```tsx
const product = dummyProducts.find((p) => p.id === id);
setProduct(product!);
```
- Procura o produto na lista `dummyProducts`
- `find()` retorna o primeiro que atende a condição
- `!` significa "tenho certeza que existe" (TypeScript)

```tsx
setRelatedProducts(dummyProducts.filter((p) => p.id !== id));
```
- Pega todos os produtos EXCETO este (para mostrar similares)

```tsx
}, [id, navigate]);
```
- **Dependency Array**: Executa quando `id` ou `navigate` mudam
- Quando user clica em outro produto, `id` muda, useEffect executa de novo

## Lógica do Carrinho

```tsx
const cartItem = items.find((item) => item.product.id === product.id);
const inCart = !!cartItem;
const displayQuantity = inCart ? cartItem.quantity : localQuantity;
```

**Passo a passo:**

1. **Procura se produto já está no carrinho**
   ```tsx
   cartItem = items.find((item) => item.product.id === product.id);
   ```
   - Se encontra, `cartItem` = objeto do item
   - Se não encontra, `cartItem` = undefined

2. **Verifica se está no carrinho**
   ```tsx
   inCart = !!cartItem;  // converte para true/false
   ```
   - `!!undefined` = false
   - `!!{...}` = true

3. **Decide qual quantidade mostrar**
   ```tsx
   displayQuantity = inCart ? cartItem.quantity : localQuantity;
   ```
   - Se já está no carrinho, mostra quantidade do carrinho
   - Se não, mostra quantidade local (que o usuário está ajustando)

## Funções de + e -

```tsx
function handleMinus() {
    if (inCart) {
        if (cartItem.quantity > 1)
            updateQuantity(product?.id, cartItem.quantity - 1);
        else 
            removeFromCart(product?.id);  // Remove se chegar a 0
    } else {
        setLocalQuantity(Math.max(1, localQuantity - 1));  // Min 1
    }
}

function handlePlus() {
    if (inCart) 
        updateQuantity(product?.id, cartItem.quantity + 1);
    else 
        setLocalQuantity(localQuantity + 1);
}
```

**O que faz:**

**Botão `-` (menos):**
- Se produto está no carrinho: diminui quantidade (ou remove se chegar a 1)
- Se não está: diminui quantidade local (mas não permite ir abaixo de 1)

**Botão `+` (mais):**
- Se produto está no carrinho: aumenta quantidade no contexto
- Se não está: aumenta quantidade local

## Por que Dois Tipos de Quantidade?

```
Usuário abre página do produto
    ↓
localQuantity = 1  (usuário vê este número)
    ↓
Usuário clica "+" 3 vezes
    ↓
localQuantity = 4
    ↓
Clica "Adicionar ao Carrinho"
    ↓
addToCart(product, localQuantity)
    ↓
Produto adicionado com quantidade 4
    ↓
Agora inCart = true
    ↓
Clica "+", usa updateQuantity (muda cartItem)
    ↓
Clica "Voltar", volta pra home
    ↓
Clica de novo no produto
    ↓
localQuantity reseta para 1 (quantidade local reseta)
    ↓
displayQuantity mostra quantidade do carrinho (4)
```

## Estrutura da Página

```
Breadcrumb (caminho: Home / Produtos / Categoria / Produto)
    ↓
Botão Voltar
    ↓
Grid com 2 colunas:
  [Imagens do produto] [Informações]
    ↓
Seção de Avaliações
    ↓
Produtos Relacionados
```

## Loading e Segurança

```tsx
if (loading) return <Loading />;
if (!product) return null;
```

- Se está carregando, mostra spinner
- Se não encontrou produto, não renderiza nada
- Evita erro ao tentar acessar propriedades de `undefined`

## Exemplo de Fluxo

```
1. User clica em produto com ID "prod123"
   ↓
2. URL muda para /product/prod123
   ↓
3. useParams pega id = "prod123"
   ↓
4. useEffect busca o produto em dummyProducts
   ↓
5. Renderiza foto, nome, preço
   ↓
6. User aumenta quantidade para 4
   ↓
7. localQuantity = 4
   ↓
8. Clica "Adicionar ao Carrinho"
   ↓
9. addToCart(product, 4) atualiza CartContext
   ↓
10. items agora tem este produto
    ↓
11. Se user clica + de novo, agora usa updateQuantity
```

## Dicas Importantes

1. **useParams** é do React Router
2. **`!!` converte para booleano** - `!!undefined` = false, `!!{...}` = true
3. **`Math.max(1, numero)`** - garante mínimo de 1
4. **find() vs filter()** - find retorna 1 item, filter retorna array
