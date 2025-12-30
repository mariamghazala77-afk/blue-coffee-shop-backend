import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

/*
  --------------------------------
  ADMIN LOGIN
  POST /api/admin/login
  --------------------------------
*/
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // 2️⃣ Compare with .env values
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      message: "Admin login successful",
    });
  }

  // 3️⃣ Wrong credentials
  return res.status(401).json({
    success: false,
    message: "Invalid admin credentials",
  });
});

export default router;

