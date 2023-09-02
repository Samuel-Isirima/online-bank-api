
import { DataTypes, Model, Optional } from 'sequelize'

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  password?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
export interface User extends Required<UserAttributes> {}