
import { DataTypes, Model, Optional } from 'sequelize'
import DatabaseConnection from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface UserObjectFromDatabase extends Required<UserAttributes> {}
export interface UserObjectForCreateUser extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserObjectForCreateUser> implements UserAttributes 
{
    public id!: number
    public first_name!: string
    public last_name!: string
    public email!: string
    public password!: string
  
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;
    
}



User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
},

{
tableName: 'users',
sequelize: DatabaseConnection,
paranoid: true,
updatedAt: 'updated_at',
createdAt: 'created_at'
},
)
  
export default User