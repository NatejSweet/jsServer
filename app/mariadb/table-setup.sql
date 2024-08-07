
CREATE DATABASE IF NOT EXISTS `worlds`;
USE `worlds`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(80) PRIMARY KEY, 
    `savedWorlds` JSON
    );

CREATE TABLE IF NOT EXISTS `worlds` (
    `id` INT AUTO_INCREMENT PRIMARY KEY, 
    `worldName` VARCHAR(50) NOT NULL, 
    `ownerId` VARCHAR(80) NOT NULL, 
    `mainImgUrl` VARCHAR(80), 
    `altImgUrl` VARCHAR(80), 
    `mainPage` JSON, 
    `pages` JSON, 
    `navItems` JSON, 
    `mapMarkers` JSON, 
    `public` Boolean
    );
