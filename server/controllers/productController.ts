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

// GET /api/products/
export async function getAllProducts(req: Request, res: Response) {
    const { category, minPrice, maxPrice, search, sort, page, limit } = req.query
    console.log('getAllProducts (patched) called with', { category, minPrice, maxPrice, search, sort, page, limit })

    try {
        const where: any = {}
        if (category && category !== 'all') where.category = category as string
        if (search) where.name = { contains: search as string, mode: 'insensitive' }
        if (minPrice || maxPrice) {
            where.price = {}
            if (minPrice) where.price.gte = Number(minPrice)
            if (maxPrice) where.price.lte = Number(maxPrice)
        }

        // pagination
        const pageNum = page ? Math.max(1, Number(page)) : 1
        const pageSize = limit ? Math.max(1, Number(limit)) : 12
        const skip = (pageNum - 1) * pageSize

        // sort mapping to match client values
        const orderBy: any = {}
        const sortVal = String(sort || '')
        if (sortVal === 'price_asc' || sortVal === 'price-asc' || sortVal === 'price_asc') orderBy.price = 'asc'
        else if (sortVal === 'price_desc' || sortVal === 'price-desc') orderBy.price = 'desc'
        else if (sortVal === 'rating') orderBy.rating = 'desc'
        else if (sortVal === 'name') orderBy.name = 'asc'
        else orderBy.createdAt = 'desc'

        const total = await prisma.product.count({ where })
        const pages = Math.max(1, Math.ceil(total / pageSize))

        const products = await prisma.product.findMany({ where, orderBy, skip, take: pageSize })

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

        return res.json({ products: productsWithDiscount, total, pages })
    } catch (error) {
        console.error('Get All Products Error:', error)
        return res.status(500).json({ message: 'Error fetching products' })
    }
}

// GET /api/products/:id
export async function getProductById(req: Request, res: Response) {

    // const { id } = req.params.id
    const product = await prisma.product.findUnique({ where: { id: String(req.params.id) } })

    if (!product) return res.status(404).json({ message: "Product not found" })

    const original = product.originalPrice ? Number(product.originalPrice) : 0;
    const current = product.price ? Number(product.price) : 0;

    const discount = (original > 0 && current > 0)
        ? Math.round(((original - current) / original) * 100)
        : 0;

    return res.json({ product: { ...product, discount } });
}

// POST /api/products/
export async function createProduct(req: Request, res: Response) {
    const product = await prisma.product.create({ data: req.body })
    return res.status(201).json({ product });
}

// POST /api/products/:id
export async function updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = await prisma.product.update({
        where: { id: String(id) },
        data: req.body
    });
    return res.json({ product });
}

// DELETE /api/products/:id
export async function deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
   await prisma.product.delete({
        where: { id: String(id) }
    });
    return res.json({ message: "Product deleted successfully" });
}
