# JS SERVER

npm i to install dependencies
npm run setup to setup database
npm run start to start server

## insatlling mariadb and create database

sudo apt install mairadb
sudo mariadb
CREATE DATABASE databaseName

CREATE USER 'user1'@localhost IDENTIFIED BY 'password1';
GRANT ALL PRIVILEGES ON _._ TO 'user1'@'localhost' IDENTIFIED BY 'password1';

then create a .env matching

##Google Auth
npm install google-auth-library

DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saves
DB_USER=user1
DB_PASSWORD=password1
