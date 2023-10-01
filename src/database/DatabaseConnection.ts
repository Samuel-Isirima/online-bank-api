import { Dialect, Sequelize } from 'sequelize'

const database_name = process.env.DATABASE as string
const database_user = process.env.DATABASE_USER as string
const database_host = process.env.DATABASE_HOST
const database_driver = process.env.DATABASE_DRIVER as Dialect
const database_password = process.env.DATABASE_PASSWORD


const sequelize = new Sequelize("", database_user, database_password, {
    dialect: database_driver
  });
  
  const create_database = () =>
  {
  return sequelize.query(`CREATE DATABASE IF NOT EXISTS ${database_name};`).then(data => {
  return true
  })
  }

  create_database()

  const DatabaseConnection: Sequelize = new Sequelize(database_name, database_user, database_password, {
    host: database_host,
    dialect: database_driver,
    logging: false
  })

  async function authenticateDatabase() 
  {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

export { DatabaseConnection, authenticateDatabase }