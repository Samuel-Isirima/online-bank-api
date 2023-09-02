import { Dialect, Sequelize } from 'sequelize'

const database_name = process.env.DATABASE_NAME as string
const database_user = process.env.DATABASE_USER as string
const database_host = process.env.DATABASE_HOST
const database_driver = process.env.DATABASE_DRIVER as Dialect
const database_password = process.env.DATABASE_PASSWORD

const DatabaseConnection = new Sequelize(database_name, database_user, database_password, {
  host: database_host,
  dialect: database_driver
})

DatabaseConnection.authenticate().then(() => 
{
    console.log('Database connection has been established successfully.')
})
.catch((error) => 
{
    console.error('Unable to connect to the database: ', error)
});

export default DatabaseConnection