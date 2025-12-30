import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* =====================================
   CLIENT — CREATE ORDER
   POST /api/orders
===================================== */
router.post("/", (req, res) => {
  const { customer_name, customer_phone, items } = req.body;

  if (!customer_name || !customer_phone) {
    return res.json({ message: "Name and phone are required" });
  }

  if (!items || items.length === 0) {
    return res.json({ message: "Cart is empty" });
  }

  // Calculate total price
  let totalPrice = 0;
  items.forEach((item) => {
    totalPrice += Number(item.price) * Number(item.quantity);
  });

  const orderSql = `
    INSERT INTO orders (customer_name, customer_phone, total_price, status)
    VALUES (?, ?, ?, 'pending')
  `;

  db.query(
    orderSql,
    [customer_name, customer_phone, totalPrice],
    (err, result) => {
      if (err) {
        console.error("ORDER INSERT ERROR:", err);
        return res.json({ message: "Order failed" });
      }

      const orderId = result.insertId;

      // Insert order items
      items.forEach((item) => {
        const itemSql = `
          INSERT INTO order_items (order_id, menu_id, quantity, unit_price)
          VALUES (?, ?, ?, ?)
        `;

        db.query(itemSql, [
          orderId,
          item.id,
          item.quantity,
          item.price,
        ]);
      });

      res.json({
        message: "Order placed successfully",
        order_id: orderId,
      });
    }
  );
});

/* =====================================
   ADMIN — GET ACTIVE ORDERS
   GET /api/orders/admin
===================================== */
router.get("/admin", (req, res) => {
  const sql = `
    SELECT *
    FROM orders
    WHERE status IN ('pending', 'preparing')
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("GET ORDERS ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

/* =====================================
   ADMIN — UPDATE ORDER STATUS
   PUT /api/orders/:id/status
===================================== */
router.put("/:id/status", (req, res) => {
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

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error("UPDATE STATUS ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Order status updated" });
  });
});

export default router;
