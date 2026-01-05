import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
console.log("MYSQLDATABASE =", process.env.MYSQLDATABASE);

// MySQL connection pool (works locally + on Railway)
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,

  // Explicit database selection (prevents "No database selected" error)
  database:  process.env.MYSQLDATABASE ||
    process.env.MYSQL_DATABASE ||
    "railway",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
