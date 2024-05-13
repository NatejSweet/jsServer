# JS SERVER, LoreKeeper

`npm i` to install dependencies
`npm run setup` to setup database
`npm run start` to start server

## insatlling mariadb and create database

sudo apt install mairadb
sudo mariadb
CREATE DATABASE databaseName

CREATE USER 'user1'@localhost IDENTIFIED BY 'password1';
GRANT ALL PRIVILEGES ON _._ TO 'user1'@'localhost' IDENTIFIED BY 'password1';

then create a .env matching:
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
DATABASE_URL =
SESSION_SECRET =
FIREBASE_API_KEY =
FIREBASE_AUTH_DOMAIN =
FIREBASE_PROJECT_ID =
FIREBASE_STORAGE_BUCKET =
FIREBASE_APP_ID =
FIREBASE_MESSAGING_SENDER_ID =
