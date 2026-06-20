# 📄 Página: MyOrders.tsx

## O que é?
É a página do painel de usuário que mostra histórico de pedidos. O usuário pode ver todos os pedidos, filtrar por status, e clicar para ver detalhes.

## Estados

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```
- Guarda lista de pedidos do usuário

```tsx
const [loading, setLoading] = useState(true);
```
- Indica se está carregando a lista

```tsx
const [activeTab, setActiveTab] = useState("all");
```
- Guarda qual aba está selecionada (all, Pendente, Enviado, etc)

```tsx
const [searchParams, setSearchParams] = useSearchParams();
```
- Lê parâmetros da URL (para funcionalidades como limpar carrinho)

## Definição de Abas

```tsx
const tabs = ["all", "Pendente", "Enviado", "Saiu para Entrega", "Entregue"];
```

São os filtros de status disponíveis. Usuário clica em uma para ver só pedidos com aquele status.

## CartContext

```tsx
const { clearCart } = useCart();
```

Função que limpa o carrinho. Usada quando pedido é finalizado.

## useEffect - Buscar Pedidos

```tsx
useEffect(() => {
    if (searchParams.get("clearCart")) {
        clearCart();                    // Limpa carrinho
        setSearchParams({});            // Remove parâmetro da URL
        setTimeout(() => {
            fetchOrders();              // Busca pedidos após delay
        }, 2000);
    } else {
        fetchOrders();                  // Busca normalmente
    }
}, [activeTab]);
```

**O que faz:**

1. **Se vem de checkout com `?clearCart`**
   ```tsx
   if (searchParams.get("clearCart"))
   ```
   - Usuário finalizou pedido e foi redirecionado aqui
   - Limpa o carrinho
   - Remove `?clearCart` da URL
   - Aguarda 2 segundos (para ver mensagem?)
   - Busca os pedidos atualizados

2. **Se é acesso normal**
   ```tsx
   else {
       fetchOrders();
   }
   ```
   - Só busca os pedidos

## Função fetchOrders

```tsx
const fetchOrders = async () => {
    setOrders(dummyDashboardOrdersData as any);
    setLoading(false);
}
```

⚠️ **FAKE DATA** - Está usando dados de exemplo (`dummyDashboardOrdersData`).

Real seria:
```tsx
// ❌ Código de exemplo
const fetchOrders = async () => {
    setOrders(dummyDashboardOrdersData as any);
    setLoading(false);
}

// ✅ Código real
const fetchOrders = async () => {
    try {
        const response = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setOrders(data);
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}
```

## Renderização das Abas

```tsx
<div className="flex gap-2 mb-6 overflow-auto pb-2">
    {tabs.map((tab) => (
        <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab 
                    ? "bg-app-green text-white"      // Aba ativa
                    : "bg-white text-app-text-light"  // Aba inativa
            }`}
        >
            {tab === "all" ? "Todos os pedidos" : tab}
        </button>
    ))}
</div>
```

**O que faz:**

1. **Mapeia cada aba**
   ```tsx
   {tabs.map((tab) => ...)}
   ```
   - Cria um botão para cada status

2. **Determina estilo**
   ```tsx
   activeTab === tab 
       ? "bg-app-green text-white"  // Verde se aba ativa
       : "bg-white text-app-text-light"  // Branco se inativa
   ```

3. **Alterna aba ao clicar**
   ```tsx
   onClick={() => setActiveTab(tab)}
   ```

**Resultado visual:**
```
┌──────────────────────────────────────────┐
│ [Todos os pedidos] [Pendente] [Enviado]  │
│ ↑ Esta aba fica verde                    │
└──────────────────────────────────────────┘
```

## Renderização Condicional de Conteúdo

```tsx
{loading ? (
    <Loading />
) : orders.length === 0 ? (
    <div>Sem pedidos ainda</div>
) : (
    <div>Lista de pedidos</div>
)}
```

**Lógica:**
- Se `loading = true` → Mostra spinner
- Senão, se `orders.length === 0` → Mostra mensagem "sem pedidos"
- Senão → Mostra lista de pedidos

## Cada Pedido - Estrutura

```tsx
<Link to={`/orders/${order._id}`} className="...">
    {/* Order id, date & status */}
    <div className="flex items-start justify-between mb-3">
        <div>
            <p className="text-sm font-medium text-app-green">
                Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <div className="flex items-center gap-2 mt-1">
                <CalendarIcon className="size-3" />
                <span className="text-xs text-app-text-light">
                    {new Date(order.createdAt).toLocaleDateString(...)}
                </span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className={`px-4 py-1 text-xs font-medium rounded-full ${
                statusColors[order.status]
            }`}>
                {order.status}
            </span>
        </div>
    </div>

    {/* Item thumbnails */}
    <div className="flex items-center gap-2 mb-3">
        {order.items.slice(0, 4).map((item, index) => (
            <img src={item.image} key={index} ... />
        ))}
        {order.items.length > 4 && (
            <div>+{order.items.length - 4}</div>
        )}
    </div>

    {/* Total itens & price */}
    <div className="flex justify-between items-center pt-3">
        <span>{order.items.length} itens</span>
        <span className="font-semibold text-app-green">
            {currency} {order.total.toFixed(2)}
        </span>
    </div>
</Link>
```

**Quebra por seção:**

### 1. Order ID e Data
```tsx
Order #{order._id.slice(-8).toUpperCase()}
```
- `slice(-8)` - Pega últimos 8 caracteres do ID
- `toUpperCase()` - Converte para maiúscula

### 2. Status Badge
```tsx
<span className={`... ${statusColors[order.status]}`}>
    {order.status}
</span>
```
- `statusColors` é um objeto que mapeia status → cores
- Exemplo:
  ```tsx
  const statusColors = {
      "Pendente": "bg-yellow-100 text-yellow-700",
      "Enviado": "bg-blue-100 text-blue-700",
      "Entregue": "bg-green-100 text-green-700"
  }
  ```

### 3. Fotos dos Produtos
```tsx
{order.items.slice(0, 4).map((item) => (
    <img src={item.image} ... />
))}
{order.items.length > 4 && (
    <div>+{order.items.length - 4}</div>
)}
```

- `slice(0, 4)` - Mostra só as 4 primeiras fotos
- Se tem mais de 4 itens, mostra "+2" (por exemplo)

**Exemplo:**
```
Pedido com 6 itens:
[foto1] [foto2] [foto3] [foto4] [+2]
         ↑ mostra 4         ↑ mostra quantas faltam
```

### 4. Total
```tsx
<span>{order.items.length} itens</span>
<span>{currency} {order.total.toFixed(2)}</span>
```
- Mostra quantidade de itens
- Mostra preço total formatado (2 casas decimais)

## Link para Detalhes

```tsx
<Link to={`/orders/${order._id}`} className="...">
```

- Ao clicar em qualquer lugar do card, vai para `/orders/id_do_pedido`
- Isso ativa a página `OrderTracking.tsx` com detalhes

## Fluxo Completo

```
1. User faz login
   ↓
2. Clica em "Meus Pedidos"
   ↓
3. MyOrders abre, loading = true
   ↓
4. fetchOrders busca dados
   ↓
5. loading = false
   ↓
6. Mostra lista de pedidos em cards
   ↓
7. User clica em um card
   ↓
8. Link navega para /orders/id_do_pedido
   ↓
9. OrderTracking renderiza com detalhes
```

## Fluxo Após Checkout

```
1. User finaliza checkout
   ↓
2. Redireciona para /orders?clearCart=true
   ↓
3. useEffect detecta clearCart na URL
   ↓
4. clearCart() limpa o carrinho
   ↓
5. setTimeout aguarda 2s
   ↓
6. fetchOrders busca pedidos atualizados
   ↓
7. Novo pedido aparece na lista
```

## Dicas Importantes

1. **`slice(0, 4)`** - Pega 4 primeiros, sem modificar original
2. **`toLocaleDateString`** - Formata data conforme idioma
3. **`toFixed(2)`** - Garante 2 casas decimais no preço
4. **`Link` vs `navigate`** - Link é melhor para navegação HTML padrão
5. Este é código com dados fake - app real busca do backend
