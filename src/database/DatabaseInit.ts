import User from "../models/User"

const isDev = process.env.NODE_ENV === 'development'

const database_init = () => {
  User.sync({ alter: isDev })
}
export default database_init 