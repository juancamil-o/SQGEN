import db from "../db.js";

// get all items
const getAllItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM items");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get item by ID
const getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM items WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// create new item
const createItem = async (req, res) => {
  const { name, qty, price } = req.body;

  if (!name || qty < 0 || price < 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO items (name, qty, price) VALUES (?, ?, ?)",
      [name, qty, price]
    );
    res.status(201).json({ id: result.insertId, name, qty, price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update existing item
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, qty, price } = req.body;

  if (!name || qty < 0 || price < 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const [result] = await db.query(
      "UPDATE items SET name = ?, qty = ?, price = ? WHERE id = ?",
      [name, qty, price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete an item
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllItems, getItemById, createItem, updateItem, deleteItem };
