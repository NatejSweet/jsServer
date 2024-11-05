const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
dotenv.config({ path: "./.env" });

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const initDb = async () => {
  const sqlQueries = [
    "CREATE DATABASE IF NOT EXISTS lorekeeper",
    "USE lorekeeper",
    "CREATE TABLE IF NOT EXISTS users (id VARCHAR(80) PRIMARY KEY, savedWorlds JSON)",
    "CREATE TABLE IF NOT EXISTS worlds ( \
      id INT AUTO_INCREMENT PRIMARY KEY, \
      worldName VARCHAR(50) NOT NULL, \
      ownerId VARCHAR(80) NOT NULL, \
      mainImgUrl VARCHAR(2048), \
      altImgUrl VARCHAR(1024), \
      mainPage JSON, \
      pages JSON, \
      navItems JSON, \
      mapMarkers JSON, \
      public BOOLEAN \
    );",
  ];
  for (let query of sqlQueries) {
    try {
      const [results, fields] = await pool.query(query);
      // console.log("Executed: " + query);
      // console.log(results);
    } catch (err) {
      console.error("Failed to execute: " + query);
      console.error(err);
    }
  }
};

const runInitDb = async () => {
  await initDb();
  process.exit();
};

runInitDb();
