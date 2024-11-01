import db from "../db.js";

// get all sales orders
const getAllSalesOrders = async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM sales_orders");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get sales order by ID
const getSalesOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const [order] = await db.query("SELECT * FROM sales_orders WHERE id = ?", [
      id,
    ]);
    if (order.length === 0) {
      return res.status(404).json({ error: "Sales order not found" });
    }

    const [items] = await db.query(
      "SELECT * FROM sales_order_items WHERE sales_order_id = ?",
      [id]
    );
    res.json({ order: order[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// create new sales order
const createSalesOrder = async (req, res) => {
  const { customer_id, items } = req.body;

  if (!customer_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    let totalOrder = 0;
    const salesOrderItems = [];

    for (const item of items) {
      const { item_id, qty, price } = item;

      // get original price
      const [originalPriceResult] = await db.query(
        "SELECT price FROM items WHERE id = ?",
        [item_id]
      );
      if (originalPriceResult.length === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      const originalPrice = originalPriceResult[0].price;
      // check that price with discount is not under 10% of the original
      if (price < originalPrice * 0.9) {
        return res.status(400).json({ error: "Discount too high" });
      }

      const subtotal = price * qty;
      totalOrder += subtotal;
      salesOrderItems.push({ item_id, qty, price, subtotal });
    }

    // insert sales order
    const [salesOrderResult] = await db.query(
      "INSERT INTO sales_orders (customer_id, total) VALUES (?, ?)",
      [customer_id, totalOrder]
    );
    const salesOrderId = salesOrderResult.insertId;

    // insert all items lines for the sales order
    for (const salesOrderItem of salesOrderItems) {
      await db.query(
        "INSERT INTO sales_order_items (sales_order_id, item_id, qty, price, subtotal) VALUES (?, ?, ?, ?, ?)",
        [
          salesOrderId,
          salesOrderItem.item_id,
          salesOrderItem.qty,
          salesOrderItem.price,
          salesOrderItem.subtotal,
        ]
      );
    }

    res.status(201).json({ id: salesOrderId, total: totalOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update a sales order
const updateSalesOrder = async (req, res) => {
  const { id } = req.params;
  const { customer_id, items } = req.body;

  if (!customer_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    await db.query("DELETE FROM sales_order_items WHERE sales_order_id = ?", [
      id,
    ]);

    let totalOrder = 0;
    const salesOrderItems = [];

    for (const item of items) {
      const { item_id, qty, price } = item;

      const [originalPriceResult] = await db.query(
        "SELECT price FROM items WHERE id = ?",
        [item_id]
      );
      const originalPrice = originalPriceResult[0].price;

      if (price < originalPrice * 0.9) {
        return res.status(400).json({ error: "Discount too high" });
      }

      const subtotal = price * qty;
      totalOrder += subtotal;
      salesOrderItems.push({ item_id, qty, price, subtotal });
    }

    await db.query(
      "UPDATE sales_orders SET customer_id = ?, total = ? WHERE id = ?",
      [customer_id, totalOrder, id]
    );

    for (const salesOrderItem of salesOrderItems) {
      await db.query(
        "INSERT INTO sales_order_items (sales_order_id, item_id, qty, price, subtotal) VALUES (?, ?, ?, ?, ?)",
        [
          id,
          salesOrderItem.item_id,
          salesOrderItem.qty,
          salesOrderItem.price,
          salesOrderItem.subtotal,
        ]
      );
    }

    res.json({
      message: "Sales order updated successfully",
      total: totalOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete sales order
const deleteSalesOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM sales_order_items WHERE sales_order_id = ?", [
      id,
    ]);
    const [result] = await db.query("DELETE FROM sales_orders WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sales order not found" });
    }

    res.json({ message: "Sales order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update a sales order as "Closed"
const closeSalesOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE sales_orders SET status = ? WHERE id = ?",
      ["closed", id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sales order not found" });
    }

    res.json({ message: "Sales order closed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  closeSalesOrder,
};
