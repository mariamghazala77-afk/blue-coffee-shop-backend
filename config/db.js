import mysql from "mysql2";
import dotenv from "dotenv";
import { URL } from "url";

dotenv.config();

// Use Railway MySQL URL
const connectionUrl =
  process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

if (!connectionUrl) {
  throw new Error("No MySQL connection URL found");
}

// Parse URL
const dbUrl = new URL(connectionUrl);

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
    console.log("MySQL connected (Railway)");
  }
});

export default db;




