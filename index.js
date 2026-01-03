import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import menuRoutes from "./routes/menu.js";
import ordersRoutes from "./routes/orders.js";
import adminAuthRoutes from "./routes/adminAuth.js";

const app = express();

/* ===============================
   CORS — GUARANTEED WORKING
================================ */
app.use(cors()); // <-- THIS FIXES IT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   STATIC FILES
================================ */
app.use("/uploads", express.static("uploads"));

/* ===============================
   ROUTES
================================ */
app.use("/api/menu", menuRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminAuthRoutes);

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
