import { Router, Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser';
import User, { UserObjectForCreateUser, UserObjectFromDatabase } from '../models/User'
import RequestValidator from '../helpers/RequestValidator';

const authRouter: Router = Router()
authRouter.post('/register', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "email": "required|string|email",
        "first_name": "required|string",
        "last_name": "required|string",
        "password": "required|string|min:6|confirmed",
        "gender": "string"
    };

await RequestValidator(req.body, validationRule, {}, (err: any, status: any) => 
{
    if (!status) 
    {
        res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
    } 
    else 
    {
        next();
    }
}).catch( err => console.log(err))


    async (payload: UserObjectForCreateUser): Promise<UserObjectFromDatabase> => {
        const user = await User.create(payload)
        return user
    }
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