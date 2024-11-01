import db from "../db.js";

// get all customers
const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get customer by ID
const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// create new customer
const createCustomer = async (req, res) => {
  const { name, phone, streetAddress1, streetAddress2, city, state, zip } =
    req.body;

  if (!name || !phone || !streetAddress1 || !city || !state || !zip) {
    return res
      .status(400)
      .json({ error: "Invalid input, missing required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO customers (name, phone, streetAddress1, streetAddress2, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, phone, streetAddress1, streetAddress2, city, state, zip]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      phone,
      streetAddress1,
      streetAddress2,
      city,
      state,
      zip,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update existing customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, streetAddress1, streetAddress2, city, state, zip } =
    req.body;

  if (!name || !phone || !streetAddress1 || !city || !state || !zip) {
    return res
      .status(400)
      .json({ error: "Invalid input, missing required fields" });
  }

  try {
    const [result] = await db.query(
      "UPDATE customers SET name = ?, phone = ?, streetAddress1 = ?, streetAddress2 = ?, city = ?, state = ?, zip = ? WHERE id = ?",
      [name, phone, streetAddress1, streetAddress2, city, state, zip, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM customers WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
