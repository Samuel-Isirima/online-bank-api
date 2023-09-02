"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_name = process.env.DATABASE_NAME;
const database_user = process.env.DATABASE_USER;
const database_host = process.env.DATABASE_HOST;
const database_driver = process.env.DATABASE_DRIVER;
const database_password = process.env.DATABASE_PASSWORD;
const DatabaseConnection = new sequelize_1.Sequelize(database_name, database_user, database_password, {
    host: database_host,
    dialect: database_driver
});
DatabaseConnection.authenticate().then(() => {
    console.log('Database connection has been established successfully.');
})
    .catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
exports.default = DatabaseConnection;
