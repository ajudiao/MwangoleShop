import { Request, Response } from 'express'; // importa os tipos do Express para tipar req e res
import { prisma } from '../config/prisma.js'; // importa a instância do Prisma para acessar o banco
import { inngest } from '../inngest/index.js';

// Create order
// POST /api/orders
export const createOrder = async (req: Request, res: Response) => { // cria um pedido
    const { items, shippingAddress, paymentMethod } = req.body; // pega itens, endereço e forma de pagamento do corpo da requisição

    if (!items || items.length === 0) { // valida se existe pelo menos um item no pedido
        return res.status(400).json({ message: 'Order items are required' }); // retorna erro 400 se não houver itens
    }

    // Busca os produtos reais no banco para evitar manipulação de preços no front-end
    const productIds = items.map((item: any) => item.productId); // extrai IDs dos produtos do pedido
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } }); // busca os produtos pelo ID

    const productMap: Record<string, (typeof products)[0]> = {}; // cria um mapa para acessar produtos por ID
    products.forEach((product) => {
        productMap[product.id] = product; // preenche o mapa com cada produto
    });

    for (const item of items) { // valida cada item do pedido
        const product = productMap[item.productId]; // encontra o produto no mapa
        if (!product || (product.stock ?? 0) < item.quantity) { // se produto não existir ou não tiver estoque suficiente
            return res.status(404).json({ message: 'Insufficient stock for one or more items' }); // retorna erro de estoque insuficiente
        }
    }

    const orderItems = items.map((item: any) => { // transforma itens do pedido usando dados do banco
        const dbProduct = productMap[item.productId]; // pega produto do banco
        if (!dbProduct) throw new Error(`Product with ID ${item.productId} not found`); // garante que o produto exista
        return {
            productId: dbProduct.id, // ID do produto
            name: dbProduct.name, // nome do produto
            image: dbProduct.image, // imagem do produto
            price: dbProduct.price, // preço real do banco
            quantity: item.quantity, // quantidade pedida pelo cliente
            unit: dbProduct.unit, // unidade do produto
        }
    })

    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0); // calcula subtotal somando preço * quantidade

    const deliveryFee = subtotal > 100 ? 0 : 2.5; // define frete grátis para pedidos acima de 100
    const taxPercent = 0.25; // valor percentual do imposto
    const tax = Math.round(subtotal * taxPercent * 100) / 100; // calcula imposto e arredonda para 2 casas
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100; // calcula total final e arredonda

    const order = await prisma.order.create({ // cria o pedido no banco de dados
        data: {
            userId: req.user?.id as string, // associa pedido ao usuário autenticado
            items: orderItems, // itens convertidos para salvar no banco
            shippingAddress, // endereço de entrega
            paymentMethod, // forma de pagamento escolhida
            subtotal, // subtotal do pedido
            deliveryFee, // valor do frete
            tax, // imposto do pedido
            total, // valor total do pedido
            statusHistory: [{ status: 'Placed', note: "Order placed successfully", timestamp: new Date() }], // histórico inicial do pedido
        }
    })

    if (paymentMethod === 'card') { // caso o pagamento seja por cartão
        // aqui poderia entrar a lógica de pagamento via cartão, como Stripe

    }

    res.json({ order }) // retorna o pedido criado para o cliente

    // Atualiza o estoque de cada produto após criar o pedido
    for (const item of orderItems) {
        await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
        })
    }
    // comentário: o código acima já reduz o estoque dos produtos do pedido

    // Send stock update events for each product in the order
    for(const item of orderItems) {
        await inngest.send({
            name: "inventory/stock.updated",
            data: { productId: item.productId }
        })
    }
    await inngest.send({
        name: "order/placed",
        data: { orderId: order.id }
    })
}


// GET
// GET /api/orders
export const getUserOrders = async (req: Request, res: Response) => { // retorna pedidos do usuário atual
    const { status } = req.query; // lê filtro de status da query string

    const where: any = {
        userId: req.user?.id, // filtra pelos pedidos do usuário autenticado
        NOT: [{ paymentMethod: "card", isPaid: false }] // exclui pedidos com cartão não pagos
    }

    if (status && status !== 'all') { // aplica filtro de status apenas se não for 'all'
        where.status = status; // adiciona condição de status na consulta
    }

    const orders = await prisma.order.findMany({ // busca pedidos no banco
        where,
        include: { deliveryPartner: { select: { id: true, phone: true } } }, // inclui informações do parceiro de entrega
        orderBy: { createdAt: 'desc' }, // ordena do mais recente para o mais antigo
    });

    res.json(orders); // retorna a lista de pedidos
}

// GET single order
// GET /api/orders/:id
export const getOrder = async (req: Request, res: Response) => { // busca um pedido específico pelo ID
    const order = await prisma.order.findFirst({ // procura o pedido no banco
        where: { id: req.params.id as string, userId: req.user!.id }, // somente se pertencer ao usuário autenticado
        include: { deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } } } // inclui dados do entregador
    })

    if (!order) // se não encontrar o pedido
        return res.status(404).json({ message: "Order not found" }) // retorna erro 404
    res.json({ order }) // retorna o pedido
}

// Update order status (admin)
// PUT /api/orders/:id/status
export const updateOrdersStatus = async (req: Request, res: Response) => { // atualiza status do pedido
    const { status, note } = req.body // pega status e nota do corpo da requisição

    const order = await prisma.order.findUnique({ // busca pedido pelo ID
        where: { id: req.params.id as string }
    })

    if (!order) // se o pedido não existir
        return res.status(404).json({ message: "Order not found" }) // retorna erro 404

    const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any[] // garante que o histórico seja array

    history.push({ status, note: note || `Order ${status.toLowerCase()}`, timestamp: new Date() }) // adiciona nova entrada ao histórico

    const updatedOrder = await prisma.order.update({ // atualiza o pedido no banco
        where: { id: req.params.id as string },
        data: { status, statusHistory: history }
    })

    res.json({ order: updatedOrder }) // retorna o pedido atualizado
}

// GET all order
// GET /api/orders/all
export const getAllOrders = async (req: Request, res: Response) => {


    const orders = await prisma.order.findMany({
        where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
        include: {
            user: { select: { name: true, email: true } },
            deliveryPartner: { select: { id: true, phone: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    res.json(orders);
}

// GET Order Location
// GET /api/order/:id/location
export const getOrderLocation = async (req: Request, res: Response) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params.id as string, userId: req.user!.id },
        select: { liveLocation: true, status: true }
    })

    if (!order)
        return res.status(404).json({ message: "Order not found" })

    res.json({ liveLocation: order.liveLocation, status: order.status })
}