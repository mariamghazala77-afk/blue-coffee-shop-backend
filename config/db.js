import mysql from "mysql2";

const db = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection error:", err);
  } else {
    console.log("✅ MySQL connected using MYSQL_PUBLIC_URL");
  }
});

export default db;
