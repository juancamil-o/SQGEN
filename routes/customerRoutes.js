import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customersController.js";

const router = express.Router();

router.get("/", getAllCustomers); // get all customers
router.get("/:id", getCustomerById); // get customer by ID
router.post("/", createCustomer); // create new customer
router.put("/:id", updateCustomer); // update customer
router.delete("/:id", deleteCustomer); // delete customer

export default router;
