
import { DataTypes, Model, Optional } from 'sequelize'
import { DatabaseConnection } from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';
import { type } from 'os';

interface CreditAttributes {
    id: number;
    user_id: number;
    amount: number;
    balance_before: number;
    balance_after: number;
    status: string;
    type: string;       //Intra: acccount within app, external
    source_account_id?: number;  //Forr intra 
    source_account_name?: string;
    source_account_bank?: string;
    source_account_number?: number;

    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;

}

export interface CreditObjectFromDatabase extends Required<CreditAttributes> {}
export interface CreditObjectForCreateCredit extends Optional<CreditAttributes,
 'id' | 'source_account_bank'| 'source_account_id' | 'source_account_name' | 'source_account_number'> {}

class Credit extends Model<CreditAttributes, CreditObjectForCreateCredit> implements CreditAttributes 
{
//correctly implement all the fields as defined in the interface
    public id!: number
    public user_id!: number
    public amount!: number
    public balance_before!: number
    public balance_after!: number
    public status!: string
    public type!: string
    public source_account_id!: number
    public source_account_name!: string
    public source_account_bank!: string
    public source_account_number!: number
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;
    
}



Credit.init({
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
     source_account_id: {
     type: DataTypes.INTEGER.UNSIGNED,
     allowNull: true,
     },
     source_account_name: {
     type: DataTypes.STRING,
     allowNull: true,
     },
     source_account_bank: {
     type: DataTypes.STRING,
     allowNull: true,
     },
     source_account_number: {
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
  
export default Credit