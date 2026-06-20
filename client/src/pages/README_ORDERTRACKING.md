# 📄 Página: OrderTracking.tsx

## O que é?
É a página de rastreamento em tempo real de um pedido específico. Mostra status, mapa ao vivo, timeline de eventos, dados do entregador e endereço de entrega.

## Hooks e Estados

```tsx
const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
```
- Símbolo da moeda (R$, $, €, etc) - vem do arquivo `.env`
- Se não definir, usa `$` como padrão

```tsx
const { id } = useParams();
```
- Pega ID do pedido da URL
- Exemplo: `/orders/123` → `id = "123"`

```tsx
const navigate = useNavigate();
```
- Permite navegar para outras páginas

```tsx
const [order, setOrder] = useState<Order | null>(null);
```
- Guarda dados do pedido

```tsx
const [loading, setLoading] = useState(true);
```
- Indica se está carregando

```tsx
const [liveLocation, setLiveLocation] = useState<{ lat: number, lng: number } | null>(null);
```
- Guarda localização em tempo real do entregador
- Latitude e longitude para o mapa

## useEffect - Buscar Pedido

```tsx
useEffect(() => {
    setOrder(dummyDashboardOrdersData.find((o) => o._id === id) as any);
    setLoading(false);
}, [id, navigate]);
```

⚠️ **FAKE DATA** - Usa dados de exemplo.

**O que faz:**
1. Procura o pedido na lista usando `find()`
2. Se encontrar, salva em `order`
3. Marca como não carregando

**Real seria:**
```tsx
useEffect(() => {
    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setOrder(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    fetchOrder();
}, [id]);
```

## Verificações de Segurança

```tsx
if (loading) return <Loading />;
if (!order) return null;
```

- Se loading, mostra spinner
- Se pedido não encontrado, renderiza nada
- Evita erros de `null is not an object`

## Estrutura da Página

```
┌─────────────────────────────────────────────┐
│ ← Voltar | Order #ID123                     │
│          | Data: 15 de junho                 │
│          | Status: Em trânsito               │
└─────────────────────────────────────────────┘

┌───────────────────────────────┐  ┌──────────┐
│ ESQUERDA                      │  │ DIREITA  │
│ - OTP do entregador           │  │ - Endereço
│ - Mapa ao vivo                │  │ - Itens  │
│ - Timeline de eventos         │  │ - Total  │
│ - Dados do entregador         │  │          │
└───────────────────────────────┘  └──────────┘
```

## Botão Voltar

```tsx
<button onClick={() => navigate("/orders")}>
    <ArrowLeftIcon className="size-4" /> Back to Order
</button>
```

- Clica para voltar à lista de pedidos
- `navigate("/orders")` vai para MyOrders.tsx

## Header - ID, Data e Status

```tsx
<div className="flex items-center justify-between mb-8">
    <div>
        <h1 className="text-2xl font-semibold text-app-green">
            Order #{order!._id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-sm text-app-text-light mt-1">
            Placed on {new Date(order!.createdAt).toLocaleDateString(...)}
        </p>
    </div>
    <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
        order.status === "Delivered" 
            ? "bg-red-100 text-green-700"
            : order!.status === "Cancelled" 
            ? "bg-red-100 text-red-700" 
            : "bg-app-orange/10 text-app-orange"
    }`}>
        {order!.status}
    </span>
</div>
```

**O que faz:**

1. **Título com ID**
   ```tsx
   Order #{order!._id.slice(-8).toUpperCase()}
   ```
   - Mostra últimos 8 caracteres em maiúscula

2. **Data formatada**
   ```tsx
   new Date(order!.createdAt).toLocaleDateString("pt-BR", {
       month: "long", day: "numeric", year: "numeric"
   })
   ```
   - Converte timestamp para data legível em português

3. **Badge de Status**
   ```tsx
   order.status === "Delivered" ? "bg-red-100 text-green-700" : ...
   ```
   - Muda cor conforme status

## Layout em Grid

```tsx
<div className="grid lg:grid-cols-3 gap-6">
    {/* Left side - 2 colunas */}
    <div className="lg:col-span-2 space-y-6">
        <OrderOTP order={order} />
        <LiveMap order={order} liveLocation={liveLocation} />
        <OrderTimeLine order={order} />
        {order?.deliveryPartner && ... && (
            <div>Dados do Entregador</div>
        )}
    </div>

    {/* Right side - 1 coluna */}
    <div className="space-y-6">
        <div>Endereço de Entrega</div>
        <div>Itens do Pedido</div>
    </div>
</div>
```

**Explicação:**
- `lg:grid-cols-3` - Em desktop: 3 colunas
- `lg:col-span-2` - Esquerda ocupa 2 colunas
- Direita ocupa 1 coluna (automático)
- Em mobile: stack vertically

## Componentes Importados

### OrderOTP
```tsx
<OrderOTP order={order} />
```
- Mostra código OTP (One-Time Password)
- Usar para confirmar entrega pessoalmente

### LiveMap
```tsx
<LiveMap order={order} liveLocation={liveLocation} />
```
- Mapa em tempo real
- Mostra localização do entregador

### OrderTimeLine
```tsx
<OrderTimeLine order={order} />
```
- Timeline com eventos:
  - Pedido recebido
  - Em processamento
  - Despachado
  - Em trânsito
  - Entregue

## Dados do Entregador

```tsx
{order?.deliveryPartner && order.status !== "Delivered" && order.status !== "Cancelled" && (
    <div className="bg-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-app-green flex-center">
                <span className="text-white text-sm font-semibold">
                    {order.deliveryPartner.name.charAt(0)}
                </span>
            </div>
            <div>
                <p className="text-sm font-semibold text-app-green">
                    {order.deliveryPartner.name}
                </p>
                <p className="text-xs text-app-text-light capitalize">
                    {order.deliveryPartner.vehicleType} * Delivery Partner
                </p>
            </div>
        </div>
        <a href={`tel:${order.deliveryPartner.phone}`}>
            <PhoneIcon className="size-4 text-app-green" />
        </a>
    </div>
)}
```

**Condicional:**
```tsx
order?.deliveryPartner &&                    // Tem entregador?
order.status !== "Delivered" &&              // Não foi entregue?
order.status !== "Cancelled"                 // Não foi cancelado?
```

**Se tudo verdadeiro, mostra:**

1. **Avatar com inicial do nome**
   ```tsx
   {order.deliveryPartner.name.charAt(0)}
   ```
   - `charAt(0)` = primeiro caractere

2. **Nome do entregador**
3. **Tipo de veículo** (moto, bicicleta, etc)
4. **Link para ligar**
   ```tsx
   <a href={`tel:${order.deliveryPartner.phone}`}>
   ```
   - `tel:` permite ligar direto do telefone

## Endereço de Entrega (Direita)

```tsx
<div className="bg-white rounded-2xl p-5">
    <h3 className="text-sm font-semibold text-app-green mb-3 flex items-center gap-2">
        <MapPinIcon className="size-4 text-app-green" />
        Delivery Address
    </h3>
    <p className="text-sm text-app-text-light leading-relaxed">
        {order?.shippingAddress.label}
        <br />
        {order?.shippingAddress.address}
        <br />
        {order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.zip}
    </p>
</div>
```

**O que mostra:**
- Label (ex: "Casa", "Trabalho")
- Endereço completo
- Cidade, estado, CEP

## Fluxo Completo

```
1. User clica em pedido em MyOrders
   ↓
2. Link navega para /orders/123
   ↓
3. useParams pega id = "123"
   ↓
4. useEffect busca pedido em dummyData
   ↓
5. Renderiza header com ID e status
   ↓
6. Renderiza layout em 3 colunas:
   - Esquerda: OTP, Mapa, Timeline, Entregador
   - Direita: Endereço, Itens, Total
   ↓
7. User pode:
   - Ver mapa ao vivo
   - Ligar para entregador
   - Ver timeline de status
```

## Dicas Importantes

1. **`order?.deliveryPartner`** - Optional chaining (seguro se null)
2. **`order!._id`** - `!` diz "tenho certeza que existe"
3. **`href="tel:${phone}"`** - Abre discador do celular
4. **`charAt(0)`** - Primeiro caractere de string
5. **Grid responsivo** - Desktop (3 cols), Mobile (1 col)
6. Este é código com dados fake - app real busca do backend
