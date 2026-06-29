import { Request, Response } from 'express';
import { prisma } from "../config/prisma.js";

// GET /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
    try {
        // Otimização: Traz apenas o necessário da BD
        const products = await prisma.product.findMany({
            where: { stock: { gt: 0 } },
            orderBy: { originalPrice: 'desc' },
            take: 8 
        });

        // O Prisma infere o tipo de 'p' automaticamente ao remover o ': any'
        const productsWithDiscount = products.map((p) => {
            const original = p.originalPrice ? Number(p.originalPrice) : 0;
            const current = p.price ? Number(p.price) : 0;

            const discount = (original > 0 && current > 0) 
                ? Math.round(((original - current) / original) * 100) 
                : 0;
            return { 
                ...p, 
                discount 
            };
        });

        return res.json({ products: productsWithDiscount });
    } catch (error) {
        console.error("Flash Deals Error:", error); 
        return res.status(500).json({ message: 'Error fetching flash deals' });
    }
};