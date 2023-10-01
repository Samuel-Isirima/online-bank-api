import User from "../models/User"
import UserEmailVerification from "../models/UserEmailVerification"
import UserPasswordRecovery from "../models/UserPasswordRecovery";
import { authenticateDatabase } from './DatabaseConnection';

const isDev = process.env.NODE_ENV === 'development'

const database_init = () => {
  // User.sync({alter: isDev})
  // UserEmailVerification.sync({alter: isDev})
  UserPasswordRecovery.sync({alter: isDev})
}
console.log('Database connection has been established successfully.');
authenticateDatabase().then(() => 
{
  database_init();
}).catch((error) => {
  console.error('An error occurred during database authentication:', error);
});

export {database_init}