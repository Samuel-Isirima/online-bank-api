import { Router, Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser';
import User, { UserObjectForCreateUser, UserObjectFromDatabase } from '../models/User'
import RequestValidator from '../helpers/RequestValidator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const authRouter: Router = Router()



authRouter.post('/register', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "email": "required|string|email",
        "first_name": "required|string",
        "last_name": "required|string",
        "password": "required|string|min:8",
        "confirm_password": "required|string|min:8",
    };

    await RequestValidator(req.body, validationRule, {}, (err: any, status: any) => 
    {
        if (!status) 
        {
            return res.status(412).send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
            } 
    }).catch( err => console.log(err))

    const payload = req.body  
    try 
    {
    var password: string = payload.password
    var saltRounds: number = 10
    var hashed_password: String = await bcrypt.hash(password, saltRounds)
    payload.password = hashed_password
          
    
    const user: UserObjectFromDatabase = await User.create(payload)
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

    await RequestValidator(req.body, validationRule, {}, (err: any, status: any) => 
    {
        if (!status) 
        {
            return res.status(412).send({
                    success: false,
                    message: 'Login unsuccessful',
                    data: err
                });
        }
    }).catch( err => console.log(err))
        
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
                            const token = jwt.sign({ id: user.id?.toString(), name: user.first_name }, `U9zCG5J?KS?0}Yq`, 
                            {
                              expiresIn: '2 days',
                            });
                       
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
authRouter.post('/change-password/generate-token', async(req: Request, res: Response) => 
{
   
})

authRouter.post('/change-password', async(req: Request, res: Response) => 
{
   
})


authRouter.post('/verify-account', async(req: Request, res: Response) => 
{
   
})

export default authRouter