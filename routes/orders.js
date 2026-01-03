import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* =====================================
   CLIENT — CREATE ORDER
   POST /api/orders
===================================== */
router.post("/", async (req, res) => {
  try {
    const { customer_name, customer_phone, items } = req.body;

    if (!customer_name || !customer_phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price
    let totalPrice = 0;
    items.forEach((item) => {
      totalPrice += Number(item.price) * Number(item.quantity);
    });

    // Insert order
    const orderSql = `
      INSERT INTO orders (customer_name, customer_phone, total_price, status)
      VALUES (?, ?, ?, 'pending')
    `;

    const [orderResult] = await db.query(orderSql, [
      customer_name,
      customer_phone,
      totalPrice,
    ]);

    const orderId = orderResult.insertId;

    // Insert order items
    const itemSql = `
      INSERT INTO order_items (order_id, menu_id, quantity, unit_price)
      VALUES (?, ?, ?, ?)
    `;

    for (const item of items) {
      await db.query(itemSql, [
        orderId,
        item.id,
        item.quantity,
        item.price,
      ]);
    }

    res.json({
      message: "Order placed successfully",
      order_id: orderId,
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
});

/* =====================================
   ADMIN — GET ACTIVE ORDERS
   GET /api/orders/admin
===================================== */
router.get("/admin", async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM orders
      WHERE status IN ('pending', 'preparing')
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* =====================================
   ADMIN — UPDATE ORDER STATUS
   PUT /api/orders/:id/status
===================================== */
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const sql = `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `;

    await db.query(sql, [status, id]);

    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;
