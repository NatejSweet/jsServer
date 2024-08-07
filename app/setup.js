const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

var mariadb = require("mariadb");
var pool = mariadb.createPool({
  host: process.env.MARIA_HOST,
  port: process.env.MARIA_PORT,
  user: process.env.MARIA_USER,
  password: process.env.MARIA_PASSWORD,
  database: process.env.MARIA_DATABASE,
});

async function createTables() {
  let conn;
  try {
    conn = await pool.getConnection();
    const result1 = await conn.query("CREATE TABLE IF NOT EXISTS users (id VARCHAR(80) PRIMARY KEY, savedWorlds JSON)");
    console.log("Users table creation result:", result1);

    const result2 = await conn.query(
      "CREATE TABLE IF NOT EXISTS worlds (id INT AUTO_INCREMENT PRIMARY KEY, worldName VARCHAR(50) NOT NULL, ownerId VARCHAR(80) NOT NULL, img1Id INT, img2Id INT, mainPage JSON, pages JSON, navItems JSON, mapMarkers JSON, public BOOLEAN)"
    );
    console.log("Worlds table creation result:", result2);
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    if (conn) conn.end();
  }
}

module.exports = createTables;
