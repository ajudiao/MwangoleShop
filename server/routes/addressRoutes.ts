import express from "express";
import auth from "../middleware/auth.js";
import { getAddresses, addAddress, deleteAddress, updateAddress } from "../controllers/addressController.js";

const addressRoutes = express.Router();
addressRoutes.get("/", auth, getAddresses);
addressRoutes.post("/", auth, addAddress);
addressRoutes.put("/:id", auth, updateAddress);
addressRoutes.delete("/:id", auth, deleteAddress);


export default addressRoutes;