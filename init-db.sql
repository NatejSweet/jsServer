CREATE DATABASE IF NOT EXISTS lorekeeper;
USE lorekeeper;

CREATE TABLE IF NOT EXISTS worlds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  worldName VARCHAR(50) NOT NULL,
  ownerId VARCHAR(80) NOT NULL,
  img1Id INT,
  img2Id INT,
  mainPage JSON,
  pages JSON,
  navItems JSON,
  mapMarkers JSON,
  public BOOLEAN
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(80) PRIMARY KEY,
  savedWorlds JSON
);
