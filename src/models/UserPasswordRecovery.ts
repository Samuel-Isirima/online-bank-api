
import { DataTypes, Model, Optional } from 'sequelize'
import {DatabaseConnection} from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';

interface UserPasswordRecoveryAttributes {
  id: number;
  email: string;
  token: string;
  expires_at: Date;
  valid: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface UserPasswordRecoveryObjectFromDatabase extends Required<UserPasswordRecoveryAttributes> {}
export interface UserPasswordRecoveryObjectForCreateUserPasswordRecovery extends Optional<UserPasswordRecoveryAttributes, 'id'> {}

class UserPasswordRecovery extends Model<UserPasswordRecoveryAttributes, UserPasswordRecoveryObjectForCreateUserPasswordRecovery> implements UserPasswordRecoveryAttributes 
{
    public id!: number
    public email!: string
    public token!: string
    public expires_at!: Date
    public valid!: boolean
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;

    
}



UserPasswordRecovery.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    },
    valid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
},

{
tableName: 'users_password_recovery',
sequelize: DatabaseConnection,
paranoid: true,
updatedAt: 'updated_at',
createdAt: 'created_at'
},

)
  
export default UserPasswordRecovery