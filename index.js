/* ===============================
   ENV CONFIG
================================ */
import dotenv from "dotenv";
dotenv.config();

/* ===============================
   IMPORTS
================================ */
import express from "express";
import cors from "cors";

/* ===============================
   ROUTES
================================ */
import menuRoutes from "./routes/menu.js";
import ordersRoutes from "./routes/orders.js";
import adminAuthRoutes from "./routes/adminAuth.js";

/* ===============================
   APP INIT
================================ */
const app = express();

/* ===============================
   CORS CONFIG (LOCAL + NETLIFY)
   This FIXES the CORS error you saw
   and does NOT break localhost
================================ */

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",              // Local React
  "https://bluecoffeeshop.netlify.app", // Netlify frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      // Allow only our frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests (VERY IMPORTANT for production)
app.options("/*", cors());

/* ===============================
   BODY PARSING
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   STATIC FILES
   (Local uploads still work)
================================ */
app.use("/uploads", express.static("uploads"));

/* ===============================
   API ROUTES
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
