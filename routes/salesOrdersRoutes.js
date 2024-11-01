import express from "express";
import {
  getAllSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  closeSalesOrder,
} from "../controllers/salesOrdersController.js";

const router = express.Router();

router.get("/", getAllSalesOrders);
router.get("/:id", getSalesOrderById);
router.post("/", createSalesOrder);
router.put("/:id", updateSalesOrder);
router.delete("/:id", deleteSalesOrder);
router.put("/:id/close", closeSalesOrder);

export default router;
