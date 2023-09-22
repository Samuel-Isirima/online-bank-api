import { Router, Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser';
import User, { UserObjectForCreateUser, UserObjectFromDatabase } from '../models/User'
import RequestValidator from '../helpers/RequestValidator';

const authRouter: Router = Router()
authRouter.post('/register', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "email": "required|string|email|unique:users",
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

authRouter.post('/login', async(req: Request, res: Response) => 
{
   
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