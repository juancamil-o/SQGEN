import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemsController.js";

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItemById); // get item by id
router.post("/", createItem); // create new item
router.put("/:id", updateItem); // update item
router.delete("/:id", deleteItem); // delete item

export default router;
