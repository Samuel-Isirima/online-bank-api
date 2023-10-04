
import { DataTypes, Model, Optional } from 'sequelize'
import { DatabaseConnection } from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';
import { type } from 'os';

interface TransactionAttributes {
    id: number;
    user_account_id: number;
    type: string;
    reference: string;
    credit_record_id?: number;
    debit_record_id?: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;

}

export interface TransactionObjectFromDatabase extends Required<TransactionAttributes> {}
export interface TransactionObjectForCreateTransaction extends Optional<TransactionAttributes, 'id' | 'credit_record_id' | 'debit_record_id'> {}

class Transaction extends Model<TransactionAttributes, TransactionObjectForCreateTransaction> implements TransactionAttributes 
{
//correctly implement all the fields as defined in the interface
    public id!: number
    public user_account_id!: number
    public type!: string
    public reference!: string
    public credit_record_id!: number
    public debit_record_id!: number
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;
    
}



Transaction.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
   //implement all the fields as defined in the interface
    user_account_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    },
    type: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    reference: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    credit_record_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    },
    debit_record_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    }
},
{
tableName: 'transactions',
sequelize: DatabaseConnection,
paranoid: true,
updatedAt: 'updated_at',
createdAt: 'created_at'
},
)
  
export default Transaction