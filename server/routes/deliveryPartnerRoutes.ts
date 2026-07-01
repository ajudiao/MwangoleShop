import express from 'express'
import { cancelDelivery, completeDelivery, getDeliveryDetails, getMyDeliveries, loginDeliveryPartner, updateDeliveryStatus, updateLocation } from '../controllers/deliveryPartnerController.js'
import deliveyAuth from '../middleware/deliveryAuth.js'

const deliveryPartnerRouter = express.Router()

deliveryPartnerRouter.post('/login', loginDeliveryPartner)
deliveryPartnerRouter.get('/my-deliveries', deliveyAuth ,getMyDeliveries)
deliveryPartnerRouter.get('/my-deliveries/:id', deliveyAuth ,getDeliveryDetails)
deliveryPartnerRouter.put('/my-deliveries/:id/complete', deliveyAuth , completeDelivery)
deliveryPartnerRouter.put('/my-deliveries/:id/cancel', deliveyAuth , cancelDelivery)
deliveryPartnerRouter.put('/my-deliveries/:id/status', deliveyAuth , updateDeliveryStatus)
deliveryPartnerRouter.put('/my-deliveries/:id/location', deliveyAuth , updateLocation)

export default deliveryPartnerRouter