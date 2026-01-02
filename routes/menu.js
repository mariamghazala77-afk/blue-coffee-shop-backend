import express from "express";
import db from "../config/db.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* GET MENU (CLIENT) */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM menu WHERE is_available = 1";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* GET MENU (ADMIN) */
router.get("/admin/all", (req, res) => {
  const sql = "SELECT * FROM menu";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* ADD MENU ITEM */
router.post("/", upload.single("image"), (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Image is optional (static images used)
  const imageUrl = req.body.image_url || null;

  const sql = `
    INSERT INTO menu (name, price, category, image_url, is_available)
    VALUES (?, ?, ?, ?, 1)
  `;

  db.query(sql, [name, price, category, imageUrl], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Menu item added" });
  });
});

/* UPDATE MENU ITEM */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, category, image_url, is_available } = req.body;

  const sql = `
    UPDATE menu
    SET name = ?, price = ?, category = ?, image_url = ?, is_available = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, price, category, image_url, is_available ?? 1, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Menu item updated" });
    }
  );
});

/* DELETE MENU ITEM */
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM menu WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Menu item deleted" });
  });
});

export default router;
