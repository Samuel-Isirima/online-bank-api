
import { DataTypes, Model, Optional } from 'sequelize'
import { DatabaseConnection } from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';

interface CardAttributes {
    id: number;
    user_id: number;
    card_number: string;
    card_holder: string;
    card_expiry: string;
    card_cvv: string;
    card_pin: string;
    card_type: string;
    card_status: string;
    card_balance: string;
    card_currency: string;
    card_country: string;
    card_city: string;
    card_state: string;
    card_zip: string;
    card_address: string;
    card_phone: string;
    card_email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;

}

export interface CardObjectFromDatabase extends Required<CardAttributes> {}
export interface CardObjectForCreateCard extends Optional<CardAttributes, 'id'> {}

class Card extends Model<CardAttributes, CardObjectForCreateCard> implements CardAttributes 
{
    public id!: number
    public user_id!: number
    public card_number!: string
    public card_holder!: string
    public card_expiry!: string
    public card_cvv!: string
    public card_pin!: string
    public card_type!: string
    public card_status!: string
    public card_balance!: string
    public card_currency!: string
    public card_country!: string
    public card_city!: string
    public card_state!: string
    public card_zip!: string
    public card_address!: string
    public card_phone!: string
    public card_email!: string
    
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;

    
}



Card.init({
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
    card_number: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_holder: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_expiry: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_cvv: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_pin: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_type: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_status: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_balance: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_currency: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_country: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_city: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_state: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_zip: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_address: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_phone: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    card_email: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    },
    updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    },
    deleted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    },
},

{
tableName: 'card',
sequelize: DatabaseConnection,
paranoid: true,
updatedAt: 'updated_at',
createdAt: 'created_at'
},
)
  
export default Card