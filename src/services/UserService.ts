import User, { UserObjectFromDatabase } from "../models/User";

class UserService {

public static async getUserById(id: number): Promise<User | null> 
{
    try 
    {
        const user = await User.findOne({ where: { id: id } });
        return user || null; // If user is not found, return null
    } 
    catch (err) {
        console.error('Error:', err);
        return null;
    }
}

public static async getUserByEmail(email: string): Promise<User | null>
{
    try 
    {
        const user = await User.findOne({ where: { email: email } });
        return user || null; // If user is not found, return null
    }
    catch (err) {
        console.error('Error:', err);
        return null;
    }
}

public static async getUserByToken(token: string): Promise<User | null> 
{
    try 
    {
        const user: User | null = await User.findOne({ where: { token: token.split(' ')[1] } }); // Remove the Bearer part from the token
        return user || null; // If user is not found, return null
    } 
    catch (err) {
        console.error('Error:', err);
        return null;
    }
}


}

export default UserService