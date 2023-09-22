
import { DataTypes, Model, Optional } from 'sequelize'
import DatabaseConnection from '../database/DatabaseConnection';

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  token?: string;

  getUserByID: (id: number) => Promise<User | null>
  getUserByEmail: (email: string) => Promise<User | null>
  generatePasswordHash: (password: string) => Promise<string>
  getUserByToken: (token: string) => Promise<User | null>
  generateToken: () => Promise<string>
}

export interface UserObjectFromDatabase extends Required<UserAttributes> {}
export interface UserObjectForCreateUser extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserObjectForCreateUser> implements UserAttributes 
{
    public id!: number
    public first_name!: string
    public last_name!: string
    public email!: string
    public password!: string
  
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;


    //methods
    public async getUserByID(id: number): Promise<User | null> {
        return User.findOne({ where: { id: id } })
    }
    public getUserByEmail!: (email: string) => Promise<User | null>
    public generatePasswordHash!: (password: string) => Promise<string>
    public getUserByToken!: (token: string) => Promise<User | null>
    public generateToken!: () => Promise<string>
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
  getUserByID: '',
  getUserByEmail: '',
  generatePasswordHash: '',
  getUserByToken: '',
  generateToken: ''
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