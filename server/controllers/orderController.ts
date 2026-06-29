import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

// Create order
// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order items are required' });
    }

    // Look uo actual price from database for each item to prevent price manipulation
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
    });

    const productMap: Record<string, (typeof products)[0]> = {};

    products.forEach((product) => {
        productMap[product.id] = product;
    });

    for (const item of items) {
        const product = productMap[item.product];
        if (!product || (product.stock ?? 0) < item.quantity) {
            return res.status(404).json({ message: 'Insufficient stock for one or more items' });
        }
    }

    const orderItems = items.map((item: any) => {
        const dbProduct = productMap[item.product];
        if (!dbProduct) throw new Error(`Product with ID ${item.product} not found`);
        return {
            productId: dbProduct.id,
            name: dbProduct.name,
            image: dbProduct.image,
            price: dbProduct.price,
            quantity: item.quantity,
            unit: dbProduct.unit,
        }
    })

    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const deliveryFee = subtotal > 100 ? 0 : 2.5; // Example: Free delivery for orders over $100
    const tax = Math.round(subtotal * 2.5 * 100) / 100; // Example: 25% tax
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    const order = await prisma.order.create({
        data: {
            userId: req.user?.id as string,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            total,
            statusHistory: [{ status: 'Placed', note: "Order placed sucessfully", timestamp: new Date() }],
        }
    })

    // if(paymentMethod === 'card') {
    //     // stripe  payment link

    // }

    res.json({ order })

    // Decrease stock
    for (const item of items) {
        await prisma.product.update({
            where: { id: item.product },
            data: { stock: { decrement: item.quantity } }
        })
    }
    // for (const item of items) {
    //     await prisma.product.update({
    //         where: { id: item.productId },
    //         data: { stock: { decrement: item.quantity } }
    //     });
    // }
}


// GET
// GET /api/orders
export const getUserOrders = async (req: Request, res: Response) => {
    const { status } = req.query;

    const where: any = {
        userId: req.user?.id,
        NOT: [{ paymentMethod: "card", isPaid: false }]
    }

    if (status && status !== 'all') {
        where.status = status;
    }

    const orders = await prisma.order.findMany({
        where,
        include: { deliveryPartner: { select: { id: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
}

// GET single order
// GET /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params, userId: req.user!.id },
        include: { deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } } }
    })

    if (!order)
        return res.status(404).json({ message: "Order not found" })
    res.json({ order })
}

// Update order status (admin)
export const updateOrdersStatus = async (req: Request, res: Response) => {
    const { status, note } = req.body

    const order = await prisma.order.findUnique({
        where: { id: req.params.id as string }
    })

    if (!order)
        return res.status(404).json({ message: "Order not found" })

    const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any[]

    history.push({ status, note: note || `Order ${status.toLowerCase()}`, timestamp: new Date() })

    const updatedOrder = await prisma.order.update({
        where: { id: req.params.id as string },
        data: { status, statusHistory: history }
    })

    res.json({ order: updatedOrder })
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