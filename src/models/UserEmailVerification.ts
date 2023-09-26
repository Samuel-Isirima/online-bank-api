
import { DataTypes, Model, Optional } from 'sequelize'
import DatabaseConnection from '../database/DatabaseConnection';
import bcrypt from 'bcrypt';

interface EmailVerificationAttributes {
  id: number;
  email: string;
  token: string;
  expires_at: Date;
  valid: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface EmailVerificationObjectFromDatabase extends Required<EmailVerificationAttributes> {}
export interface EmailVerificationObjectForCreateEmailVerification extends Optional<EmailVerificationAttributes, 'id'> {}

class EmailVerification extends Model<EmailVerificationAttributes, EmailVerificationObjectForCreateEmailVerification> implements EmailVerificationAttributes 
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



EmailVerification.init({
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
  
export default EmailVerification