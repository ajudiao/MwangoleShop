import express from "express";
import auth from "../middleware/auth.js";
import { createOrder, getAllOrders, getOrder, getOrderLocation, getUserOrders, updateOrdersStatus } from "../controllers/orderController.js";
import admin from "../middleware/admin.js";


const orderRouter = express.Router()

orderRouter.get('/all', auth, admin, getAllOrders)
orderRouter.post('/', auth, createOrder)
orderRouter.get('/', auth, getUserOrders)
orderRouter.get('/:id/live-location', auth, getOrderLocation)
orderRouter.get('/:id/location', auth, getOrderLocation)
orderRouter.put('/:id/status', auth, admin, updateOrdersStatus)
orderRouter.get('/:id', auth, getOrder)

export default orderRouter