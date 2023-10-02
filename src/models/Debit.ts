
import { DataTypes, Model, Optional } from 'sequelize'
import { DatabaseConnection } from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';
import { type } from 'os';

interface DebitAttributes {
    id: number;
    user_id: number;
    amount: number;
    balance_before: number;
    balance_after: number;
    status: string;
    type: string;       //Intra: acccount within app, external
    destination_account_id?: number;  //For intra 
    destination_account_name?: string;
    destination_account_bank?: string;
    destination_account_number?: number;

    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;

}

export interface DebitObjectFromDatabase extends Required<DebitAttributes> {}
export interface DebitObjectForCreateDebit extends Optional<DebitAttributes,
 'id' | 'destination_account_bank'| 'destination_account_id' | 'destination_account_name' | 'destination_account_number'> {}

class Debit extends Model<DebitAttributes, DebitObjectForCreateDebit> implements DebitAttributes 
{
//correctly implement all the fields as defined in the interface
    public id!: number
    public user_id!: number
    public amount!: number
    public balance_before!: number
    public balance_after!: number
    public status!: string
    public type!: string
    public destination_account_id!: number
    public destination_account_name!: string
    public destination_account_bank!: string
    public destination_account_number!: number
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;
    
}



Debit.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
//implement all the fields as defined in the interface
    user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    },
    amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0.00,
    },
    balance_before: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0.00,
    },
    balance_after: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0.00,
    },
    status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    },
    type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'intra',
    },
    destination_account_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    },
    destination_account_name: {
    type: DataTypes.STRING,
    allowNull: true,
    },
    destination_account_bank: {
    type: DataTypes.STRING,
    allowNull: true,
    },
    destination_account_number: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    }},

{
tableName: 'card',
sequelize: DatabaseConnection,
paranoid: true,
updatedAt: 'updated_at',
createdAt: 'created_at'
},
)
  
export default Debit