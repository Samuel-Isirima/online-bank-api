import { Router, Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser';
import User, { UserObjectForCreateUser, UserObjectFromDatabase } from '../models/User'
import RequestValidator from '../helpers/RequestValidator';
import bcrypt from 'bcrypt';
import Transaction from '../models/Transaction';
const financialAccountRouter: Router = Router()



financialAccountRouter.post('/fund', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "amount": "required|number|min:20",
        "recipient_account_number": "required_without:recipient_account_tag|string",
        "recipient_account_tag": "required_without:recipient_account_number|string",
    };


   
})

financialAccountRouter.post('/withdraw', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "amount": "required|number|min:20",
        "recipient_account_number": "required_without:recipient_account_tag|string",
        "recipient_account_tag": "required_without:recipient_account_number|string",
    };


   
})

export default financialAccountRouter