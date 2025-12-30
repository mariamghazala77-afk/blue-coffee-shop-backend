import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import menuRoutes from "./routes/menu.js";
import ordersRoutes from "./routes/orders.js";
import adminAuthRoutes from "./routes/adminAuth.js";

const app = express();

/*
  -----------------------------
  Middleware
  -----------------------------
*/
app.use(cors());
app.use(express.json());

/*
  -----------------------------
  Static folders
  -----------------------------
*/
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("images"));

/*
  -----------------------------
  Routes
  -----------------------------
*/
app.use("/api/menu", menuRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminAuthRoutes);

/*
  -----------------------------
  Start server
  -----------------------------
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("ADMIN EMAIL:", process.env.ADMIN_EMAIL);
});
