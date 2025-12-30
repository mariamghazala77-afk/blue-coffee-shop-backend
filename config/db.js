import mysql from "mysql2";
import { URL } from "url";

/*
  Choose DB URL based on environment
  - Local development → MYSQL_PUBLIC_URL
  - Railway production → MYSQL_URL
*/
const connectionUrl =
  process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

if (!connectionUrl) {
  throw new Error("No MySQL connection URL found in environment variables");
}

// Parse the URL safely
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
    console.log("MySQL connected successfully");
  }
});

export default db;


