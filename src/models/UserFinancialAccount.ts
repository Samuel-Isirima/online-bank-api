
import { DataTypes, Model, Optional } from 'sequelize'
import {DatabaseConnection} from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';

interface UserFinancialAccountAttributes {
  id: number;
  user_id: number;
  account_number: string;
  account_balance: number;
  currency: string;
  status: boolean;
  tag?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface UserFinancialAccountObjectFromDatabase extends Required<UserFinancialAccountAttributes> {}
export interface UserFinancialAccountObjectForCreateUserFinancialAccount extends Optional<UserFinancialAccountAttributes, 'id'> {}

class UserFinancialAccount extends Model<UserFinancialAccountAttributes, UserFinancialAccountObjectForCreateUserFinancialAccount> implements UserFinancialAccountAttributes 
{
    public id!: number
    public user_id!: number
    public account_number!: string
    public account_balance!: number
    public currency!: string
    public status!: boolean
    public tag!: string
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;

    
}



UserFinancialAccount.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    },
    account_number: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    account_balance: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0.00,
    },
    currency: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    },
    tag: {
    type: DataTypes.STRING,
    allowNull: true,
    },
},

{
tableName: 'users_financial_account',
sequelize: DatabaseConnection,
paranoid: true,
updatedAt: 'updated_at',
createdAt: 'created_at'
},

)
  
export default UserFinancialAccount