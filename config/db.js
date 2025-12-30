import dotenv from "dotenv";
dotenv.config(); // ✅ FORCE env to load here

import mysql from "mysql2";
import { URL } from "url";


// Parse Railway PUBLIC MySQL URL safely
const dbUrl = new URL(process.env.MYSQL_PUBLIC_URL);

const db = mysql.createConnection({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("MySQL connected successfully (Railway PUBLIC)");
  }
});

export default db;



