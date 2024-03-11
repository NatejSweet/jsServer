//it there s a database
//make your server user
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

var mariadb = require("mariadb");
var pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

module.exports = Object.freeze({
  pool: pool,
});

async function dropTables() {
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      "DROP TABLES IF EXISTS users,worlds,images"
    );
    console.log(result);
    if (conn) conn.end();
    // Authentication failed
  } catch (err) {
    console.log(err);
    res.status(500).send("drop table failed");
  }
}
async function createTables() {
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      "CREATE TABLE users (id VARCHAR(80) PRIMARY KEY, savedWorlds JSON)"
    );
    console.log(result);
    // Authentication failed
  } catch (err) {
    console.log(err);
    res.status(500).send("create table failed");
    if (conn) conn.end();
  }
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      "CREATE TABLE worlds (id INT AUTO_INCREMENT PRIMARY KEY,worldName VARCHAR(50) NOT NULL,ownerId VARCHAR(80) NOT NULL,img1Id INT,img2Id INT,mainPage JSON,pages JSON,navItems JSON, mapMarkers JSON, public Boolean)"
    );
    console.log(result);
    if (conn) conn.end();
    // Authentication failed
  } catch (err) {
    console.log(err);
    res.status(500).send("create table failed");
  }
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      "CREATE TABLE images(id INT AUTO_INCREMENT PRIMARY KEY, src MEDIUMTEXT, ownerId VARCHAR(80) NOT NULL);"
    );
    console.log(result);
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    // res.status(500).send('create table failed');
  }
}
dropTables();
createTables();
/*for creation                    
CREATE TABLE worlds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worldName VARCHAR(50) NOT NULL,
    ownerId INT NOT NULL,
    img1Id INT,
    img2Id INT,
    mainPage BLOB,
    pages BLOB,
    navNames BLOB,
    navItems BLOB
);
*/
// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     savedWorlds JSON,
//
// )
