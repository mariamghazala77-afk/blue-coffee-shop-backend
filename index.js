import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import menuRoutes from "./routes/menu.js";
import ordersRoutes from "./routes/orders.js";
import adminAuthRoutes from "./routes/adminAuth.js";

// Enable .env
dotenv.config();

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
  Static folders (IMPORTANT)
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
app.listen(5000, () => {
  console.log("Server running on port 5000");
  console.log("ADMIN EMAIL:", process.env.ADMIN_EMAIL); // test
});
