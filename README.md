# JS SERVER
npm i to install dependencies
npm run setup to setup database
npm run start to start server
and npm run dl to install mariadb if on ubuntu

## insatlling mariadb on ubuntu
sudo apt install mairadb 
sudo mysql.server start
mariadb
ur in the mariadb shell now
create a database for everything - CREATE DATABASE databaseName
access sql database - USE mysql;
create a user in this database - INSERT into users 

CREATE USER 'user1'@localhost IDENTIFIED BY 'password1';

GRANT ALL PRIVILEGES ON *.* TO 'user1'@localhost IDENTIFIED BY 'password1';