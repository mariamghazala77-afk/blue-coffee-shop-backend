import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // ✅ يجب أن يكون أول شيء

import express from "express";
import cors from "cors";

import menuRoutes from "./routes/menu.js";
import ordersRoutes from "./routes/orders.js";
import adminAuthRoutes from "./routes/adminAuth.js";

const app = express();

app.use(cors());
app.use(express.json());

// ❌ لا نستخدم uploads محلي في production (لكن وجوده لا يكسر)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminAuthRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
