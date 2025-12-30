import mysql from "mysql";

/*
  Create MySQL connection
  Using the same style as shown in class
*/
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blue_coffee_shop",
});

/*
  Connect to database
*/
db.connect((err) => {
  if (err) {
    console.log("Database connection error:", err);
  } else {
    console.log("MySQL connected");
  }
});

export default db;
