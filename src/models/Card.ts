
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

}

export interface CardObjectFromDatabase extends Required<CardAttributes> {}
export interface CardObjectForCreateCard extends Optional<CardAttributes, 'id'> {}

class Card extends Model<CardAttributes, CardObjectForCreateCard> implements CardAttributes 
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



Card.init({
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
    allowNull: true
  },
},

{
tableName: 'users_email_verification',
sequelize: DatabaseConnection,
paranoid: true,
updatedAt: 'updated_at',
createdAt: 'created_at'
},
)
  
export default Card