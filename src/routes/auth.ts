import { Router, Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser';
import User, { UserObjectForCreateUser, UserObjectFromDatabase } from '../models/User'
import RequestValidator from '../helpers/RequestValidator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../services/UserService';
import UserEmailVerification from '../models/UserEmailVerification';
import { UUIDV4 } from 'sequelize';
const authRouter: Router = Router()



authRouter.post('/register', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    var user: UserObjectFromDatabase | null
    const validationRule = {
        "email": "required|string|email",
        "first_name": "required|string",
        "last_name": "required|string",
        "password": "required|string|min:8",
        "confirm_password": "required|string|min:8",
    };

    const validationResult: any = await RequestValidator(req.body, validationRule, {})
    .catch((err) => {
    console.error(err)
    })

    if(validationResult.status === false)
    {
    console.log(validationResult.errors)
    const errorMessages: string[] = extractValidationErrorMessages(validationResult.errors)
    return res.status(401).send({ message: `Validation failed. Error: ${errorMessages}`})
    }

    const payload = req.body  
    try 
    {
    var password: string = payload.password
    var saltRounds: number = 10
    var hashed_password: string = await bcrypt.hash(password, saltRounds)
    payload.password = hashed_password
          
    
    const user: UserObjectFromDatabase = await User.create(payload)
    //generate random string token for email verification
    const token: string = generateRandomString(52)
    
    //Now create the email verification record
    UserEmailVerification.create({ email: user.email, token: token, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1), valid: true})
    .catch( err => console.log(err))

    } 
    catch (error) 
    {
    console.log(error)
    return res.status(403).send({ message: `An unexpected error has occured. Please try again later.`,
    error: error})
    }

       return res.status(200).send({ message: `Account created successfully. Welcome to the bank API!`})


})

authRouter.post('/login', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "email": "required|string|email",
        "password": "required|string|min:8",
    };

    const validationStatus = await RequestValidator(req.body, validationRule, {})
    .catch((err) => {
      console.error(err);
      // Handle any errors that occur during validation
      // You can choose to reject the promise or handle the error here.
    });
        
        //Now try to log user in
        const payload = req.body
        const email = payload.email
        const password = payload.password
        User.findOne({ where: { email: email } }).then((user: UserObjectFromDatabase | null) =>
        {
            if (user === null) 
            {
                return res.status(404).send({ message: `User with email ${email} not found`})
            }
            else
            {
                bcrypt.compare(password, user.password, (err: any, result: any) => 
                {
                    if (err) 
                    {
                        return res.status(401).send({ message: `An unexpected error has occured. Please try again later.`})
                    }
                    if (result) 
                    {
                            const token = jwt.sign({ id: user.id?.toString(), name: user.first_name }, process.env.APP_JSON_SECRET as string, 
                            {
                              expiresIn: '30 days',
                            });
                        //Now update the user with the token
                        User.update({ token: token }, { where: { id: user.id } })
                        return res.status(200).send({ message: `Login successful`, user: {first_name: user.first_name, email: user.email, token: token}})
                    }
                    else
                    {
                        return res.status(401).send({ message: `Invalid password`})
                    }
                })
            }
        })
})



authRouter.post('/change-password', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "old_password": "required|string|min:8",
        "password": "required|string|min:8",
        "confirm_password": "required|string|min:8",
    };

    const validationStatus = await RequestValidator(req.body, validationRule, {})
    .catch((err) => {
      console.error(err);
      // Handle any errors that occur during validation
      // You can choose to reject the promise or handle the error here.
    });

    //get the user
    const token: string | undefined = req.header('authorization');
    if(token === undefined)
    {
        return res.status(401).send({ message: `Unauthorized`})
    }
    const user: User | null = await UserService.getUserByToken(token)
    if(user === null)
    {
        return res.status(404).send({ message: `Account not found`})
    }

    //Check that new password and confirm password match
    const new_password = req.body.password
    const confirm_password = req.body.confirm_password
    if(new_password !== confirm_password)
    {
        return res.status(401).send({ message: `New password and confirm password do not match`})
    }

    //Now check that old password is correct
    const old_password = req.body.old_password
    const user_password = user.password
    bcrypt.compare(old_password, user_password, async(err: any, result: any) => 
    {
        if (err) 
        {
            return res.status(401).send({ message: `An unexpected error has occured. Please try again later.`})
        }
        if (result) 
        {
            //Now update the password
            const new_password = req.body.password
            const saltRounds: number = 10
            const hashed_password: string = await bcrypt.hash(new_password, saltRounds)
            User.update({ password: hashed_password }, { where: { id: user.id } })
            return res.status(200).send({ message: `Password changed successfully`})
        }
        else
        {
            return res.status(401).send({ message: `Old password incorrect`})
        }
    })
   
})


authRouter.get('/user', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const token: string | undefined = req.header('authorization');
    if(token === undefined)
    {
        return res.status(401).send({ message: `Unauthorized`})
    }
    const user: User | null = await UserService.getUserByToken(token)
    if(user === null)
    {
        return res.status(404).send({ message: `User not found`})
    }

    //Return user
    return res.status(200).send({ message: `User found`, user: {first_name: user?.first_name, email: user?.email, token: user?.token}})
})



authRouter.post('/account/verify', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "email": "required|string|email",
        "person": "required|string",
        "token": "required|string"
    };

    const validationStatus = await RequestValidator(req.body, validationRule, {})
    .catch((err) => {
      console.error(err);
      // Handle any errors that occur during validation
      // You can choose to reject the promise or handle the error here.
    });
  
  
    //get the email verification record
    const token = req.body.token
    const emailVerification: UserEmailVerification | null = await UserEmailVerification.findOne({ where: { token: token, email: req.body.email } })

    if(emailVerification === null)
    {
        return res.status(404).send({ message: `Email verification record not found`})
    }

    //Check that the token has not expired
    const expires_at = emailVerification.expires_at
    const now = new Date()
    if(now > expires_at)
    {
        //return res.status(401).send({ message: `Token has expired`})
    }

    //Check that the token is valid
    const valid = emailVerification.valid
    if(valid === false)
    {
        //return res.status(401).send({ message: `Token is not valid`})
    }

    //return res.status(200).send({ message: `Email verified successfully`})

})

const generateRandomString = (length) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


function extractValidationErrorMessages(errors: any): string[] {
const errorMessages: string[] = [];

for (const field in errors) {
    if (Array.isArray(errors[field])) {
    errorMessages.push(...errors[field]);
    }
}

return errorMessages;
}

export default authRouter