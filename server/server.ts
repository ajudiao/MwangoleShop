import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";

const app = express();

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/addresses", addressRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    // res.status(500).json({ message: 'Something went wrong!' });
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});