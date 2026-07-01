import { Request, Response } from "express"
import { prisma } from "../config/prisma.js"
import bcrypt from "bcrypt"


// get admin deashboard data
// outro nome seria getAdminStats getAdminDashboardData
export const getAdminStats = async (req: Request, res: Response) => {
    const [totalOrders, totalUsers, totalProducts, outOfStock, totalPartners, recentOrders] = await Promise.all([
        prisma.order.count({
            where: { NOT: [{ paymentMethod: "card", isPaid: false }] }
        }),
        prisma.user.count(),
        prisma.product.count(),
        prisma.product.count({
            where: { stock: { equals: 0 } }
        }),
        prisma.deliveryPartner.count(),
        prisma.order.findMany({
            where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
            orderBy: { createdAt: "desc" },
            take: 8,
            include: {
                user: { select: { name: true, email: true } },
                deliveryPartner: { select: { id: true, phone: true } }
            }
        })
    ])

    res.json({totalOrders, totalUsers, totalProducts, outOfStock, totalPartners, recentOrders })
}

// get delivery partners list for admin
export const getDeliveryPartners = async (req: Request, res: Response) => {
    const deliveryPartners = await prisma.deliveryPartner.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, phone: true, email: true, createdAt: true }
    })
    res.json({ deliveryPartners })
}

// create delivery partner profile for admin
export const createDeliveryPartner = async (req: Request, res: Response) => {
    const { name, phone, email, vehicleType } = req.body

    if(!name || !phone || !email || !vehicleType) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const hashPassword = await bcrypt.hash("defaultpassword", 10)
    const partner = await prisma.deliveryPartner.create({
        data: { name, phone, email: email.toLowerCase(), vehicleType, password: hashPassword }
    })

    res.status(201).json({ partner })

}

// Update delivery partner profile for admin
export const updateDeliveryPartner = async (req: Request, res: Response) => {
    // const { name, phone, email, vehicleType, isActive } = req.body
    const { name, phone, vehicleType, isActive } = req.body

    const data: any = {}
    if(name) data.name = name
    if(phone) data.phone = phone
    // if(email) data.email = email.toLowerCase()
    if(vehicleType) data.vehicleType = vehicleType
    if(isActive !== undefined) data.isActive = isActive

    try {
        const partner = await prisma.deliveryPartner.update({
            where: { id: req.params.id as string },
            data
        })
        res.json({ partner })
    }catch (error: any) {
        console.error(error.message)
        res.status(404).json({ message: "Delivery partner not found" })
    }
}

// assign delivery partner to order for admin
export const assignDeliveryPartner = async (req: Request, res: Response) => {
    const { partnerId } = req.body

    const order = await prisma.order.findUnique({
        where: { id: req.params.id as string }
    })

    const partner = await prisma.deliveryPartner.findUnique({
        where: { id: partnerId }
    })

    if(!order || !partner) {
        return res.status(404).json({ message: "Order or delivery partner not found" })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)) // generate 6 digit OTP

    let status = order!.status

    const history = (Array.isArray(order!.statusHistory) ? order!.statusHistory : []) as any[] // garante que o histórico seja array

    if (order!.status === "Placed" || order!.status === "Confirmed") {
        status = "Assigned"
        history.push({ status, note: `Order assigned to delivery partner ${partner!.name}`, timestamp: new Date() }) // adiciona nova entrada ao histórico
    }

    await prisma.order.update({
        where: { id: order!.id },
        data: { deliveryPartnerId: partner!.id, deliveryOtp: otp, status: status, statusHistory: history }
    })

    res.json({ order })
}