import express from "express";
const app = express();
app.use(express.json());

// routes imports
import customersRoutes from "./routes/customerRoutes.js";
import itemsRoutes from "./routes/itemsRoutes.js";
import salesOrdersRoutes from "./routes/salesOrdersRoutes.js";

app.use("/customers", customersRoutes);
app.use("/items", itemsRoutes);
app.use("/sales_orders", salesOrdersRoutes);

export default app;
