
import { DataTypes, Model, Optional } from 'sequelize'
import {DatabaseConnection} from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';

interface BankAttributes {
  id: number;
  name: string;
  secret_key: string;
  api_key: string;
  transaction_endpoint: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface BankObjectFromDatabase extends Required<BankAttributes> {}
export interface BankObjectForCreateBank extends Optional<BankAttributes, 'id'> {}

class Bank extends Model<BankAttributes, BankObjectForCreateBank> implements BankAttributes 
{
    public id!: number
    public name!: string
    public secret_key!: string
    public api_key!: string
    public transaction_endpoint!: string
  
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;
}



Bank.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    secret_key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    api_key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_endpoint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
},

{
tableName: 'banks',
sequelize: DatabaseConnection,
paranoid: true,
updatedAt: 'updated_at',
createdAt: 'created_at'
},
)
  
export default Bank