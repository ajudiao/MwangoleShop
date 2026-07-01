import { prisma } from "../config/prisma.js"
import { Request, Response } from "express"


// Get user addresses
// GET /api/addresses
export const getAddresses = async (req: Request, res: Response) => {
    const addresses = await prisma.address.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
    })
    res.json({addresses})
}

// Add new address
// POST /api/addresses
export const addAddress = async (req: Request, res: Response) => {
    const { label, address, city, state, zip, isDefault, lat, lng } = req.body

    // Require coordinates if isDefault is true
    if (isDefault && (!lat || !lng)) {
        return res.status(400).json({ message: "Latitude and longitude are required for default address" })
    }

    if(!lat || !lng) { 
        return res.status(400).json({ message: "Latitude and longitude are required" })
    }


    const currentAddresses = await prisma.address.findMany({
        where: { userId: req.user!.id }
    })
    
    let makeDefault = isDefault || currentAddresses.length === 0 // Make default if it's the first address or isDefault is true

    if (makeDefault) {
        // Unset previous default addresses
        await prisma.address.updateMany({
            where: { userId: req.user!.id, isDefault: true },
            data: { isDefault: false }
        })
    }

    await prisma.address.create({
        data: {
            userId: req.user!.id,
            label,
            address,
            city,
            state,
            zip,
            isDefault: makeDefault,
            lat: Number(lat),
            lng: Number(lng)
        }
    })

    const addresses = await prisma.address.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
    })

    res.status(201).json({ addresses })
}

// Update address
// PUT /api/addresses/:id
export const updateAddress = async (req: Request, res: Response) => {
    const { label, address, city, state, zip, isDefault, lat, lng } = req.body

    if(!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" })
    }

    if(isDefault) {
        // Unset previous default addresses
        await prisma.address.updateMany({
            where: { userId: req.user!.id },
            data: { isDefault: false }
        })
    }

    const data: any = {}
    if(label) data.label = label
    if(address) data.address = address
    if(city) data.city = city
    if(state) data.state = state
    if(zip) data.zip = zip
    if(lat != null) data.lat = Number(lat)
    if(lng != null) data.lng = Number(lng)
    if(isDefault !== undefined) data.isDefault = isDefault

    try {
        await prisma.address.update({
            where: { id: req.params.id as string, userId: req.user!.id },
            data
        })
        const addresses = await prisma.address.findMany({
            where: { userId: req.user!.id },
            orderBy: { createdAt: "asc" },
        })
        res.json({ addresses })
    } catch (error: any) {
        console.error(error)
        return res.status(404).json({ message: "Address not found" })
    }
}

// Delete address
// DELETE /api/addresses/:id
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prisma.address.delete({
            where: { id: req.params.id as string, userId: req.user!.id }
        })
        const addresses = await prisma.address.findMany({
            where: { userId: req.user!.id },
            orderBy: { createdAt: "asc" },
        })
        res.json({ addresses })
    } catch (error: any) {
        console.error(error)
        return res.status(404).json({ message: "Address not found" })
    }
}