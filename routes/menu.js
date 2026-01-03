import express from "express";
import db from "../config/db.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =====================================================
   GET MENU ITEMS (CLIENT SIDE)
   - Returns only available items
===================================================== */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM menu WHERE is_available = 1"
    );
    res.json(rows);
  } catch (err) {
    console.error("GET MENU ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   GET MENU ITEMS (ADMIN SIDE)
   - Returns all items (available + unavailable)
===================================================== */
router.get("/admin/all", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM menu");
    res.json(rows);
  } catch (err) {
    console.error("GET ADMIN MENU ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ADD MENU ITEM
   - Image is REQUIRED
===================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // Validate text fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Validate image upload
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Build image URL from uploaded file
    const imageUrl = "/uploads/" + req.file.filename;

    // Insert menu item into database
    await db.query(
      `INSERT INTO menu (name, price, category, image_url, is_available)
       VALUES (?, ?, ?, ?, 1)`,
      [name, price, category, imageUrl]
    );

    res.json({ message: "Menu item added successfully" });

  } catch (err) {
    console.error("ADD MENU ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE MENU ITEM
   - Image is OPTIONAL
   - Keeps old image if no new image is uploaded
===================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const menuId = req.params.id;

    // 1️⃣ Get current image from database
    const [rows] = await db.query(
      "SELECT image_url FROM menu WHERE id = ?",
      [menuId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Start with existing image
    let finalImageUrl = rows[0].image_url;

    // 2️⃣ If a new image is uploaded → replace it
    if (req.file) {
      finalImageUrl = "/uploads/" + req.file.filename;
    }

    // 3️⃣ Update menu item safely
    await db.query(
      `UPDATE menu
       SET name = ?, price = ?, category = ?, image_url = ?
       WHERE id = ?`,
      [name, price, category, finalImageUrl, menuId]
    );

    res.json({ message: "Menu item updated successfully" });

  } catch (err) {
    console.error("UPDATE MENU ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   DELETE MENU ITEM
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM menu WHERE id = ?", [req.params.id]);
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("DELETE MENU ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
