import { Sequelize } from "sequelize";

const sequelize_database_connection: Sequelize = new Sequelize()


sequelize_database_connection.authenticate().then(() => 
{
    console.log('Connection has been established successfully.');
})
.catch((error) => 
{
    console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize_database_connection