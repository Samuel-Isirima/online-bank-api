//Create an email verification model

import { DataTypes, Model, Optional } from 'sequelize'
import DatabaseConnection from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id: number;
  user_email: string;
  user_id: string;
  token: string;
  validity: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  token?: string;
}

export interface EmailVerificationObjectFromDatabase extends Required<UserAttributes> {}
export interface EmailVerificationObjectForCreateUser extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, EmailVerificationObjectForCreateUser> implements UserAttributes 
{
    public id!: number
    public first_name!: string
    public last_name!: string
    public email!: string
    public password!: string
    public token!: string
  
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
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true
  },
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