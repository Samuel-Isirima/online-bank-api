import { Router, Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser';
import User, { UserObjectForCreateUser, UserObjectFromDatabase } from '../models/User'
import RequestValidator from '../helpers/RequestValidator';
import bcrypt from 'bcrypt';
import Transaction from '../models/Transaction';
import UserFinancialAccount from '../models/UserFinancialAccount';
const transactionRouter: Router = Router()



transactionRouter.post('/send/intra', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "amount": "required|number|min:20",
        "sender_account_id": "required|number",
        "recipient_account_number": "required_without:recipient_account_tag|string",
        "recipient_account_tag": "required_without:recipient_account_number|string",
    };

    const validationResult: any = await RequestValidator(req.body, validationRule, {})
    .catch((err) => {
    console.error(err)
    })

    if(validationResult.status === false)
    {
    const errorMessages: string[] = extractValidationErrorMessages(validationResult.errors)
    return res.status(401).send({ message: `Transaction failed. ${errorMessages}`})
    }

    const payload = req.body  

    //Deconstruct the payload
    const { amount, sender_account_id, recipient_account_number, recipient_account_tag } = payload

    //Confirm that the sender account exists
    const senderAccount = await UserFinancialAccount.findOne({ where: { id: sender_account_id } })
    if(!senderAccount)
    {
        return res.status(401).send({ message: `Transaction failed. Source account does not exist.`})
    }

    //Confirm that the sender account is active
    if(senderAccount.status === false)
    {
        return res.status(401).send({ message: `Transaction failed. Source account is inactive.`})
    }
   
})



transactionRouter.post('/send/inter', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "amount": "required|number|min:20",
        "recipient_account_number": "required_without:recipient_account_tag|string",
        "recipient_account_tag": "required_without:recipient_account_number|string",
    };

    const validationResult: any = await RequestValidator(req.body, validationRule, {})
    .catch((err) => {
    console.error(err)
    })

    if(validationResult.status === false)
    {
    const errorMessages: string[] = extractValidationErrorMessages(validationResult.errors)
    return res.status(401).send({ message: `Transaction failed. ${errorMessages}`})
    }

    const payload = req.body  
   
})



transactionRouter.get('/all', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "amount": "required|number|min:20",
        "recipient_account_number": "required_without:recipient_account_tag|string",
        "recipient_account_tag": "required_without:recipient_account_number|string",
    };

    const validationResult: any = await RequestValidator(req.body, validationRule, {})
    .catch((err) => {
    console.error(err)
    })

    if(validationResult.status === false)
    {
    const errorMessages: string[] = extractValidationErrorMessages(validationResult.errors)
    return res.status(401).send({ message: `Transaction failed. ${errorMessages}`})
    }

    const payload = req.body  
   
})



transactionRouter.get('/get', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "transaction_ref": "required|number",
    };

    const validationResult: any = await RequestValidator(req.body, validationRule, {})
    .catch((err) => {
    console.error(err)
    })

    if(validationResult.status === false)
    {
    const errorMessages: string[] = extractValidationErrorMessages(validationResult.errors)
    return res.status(401).send({ message: `Failed to fetch transaction. ${errorMessages}`})
    }

    const payload = req.body  
   
    const transaction = await Transaction.findOne({ where: { reference: payload.transaction_ref } })

    if(!transaction)
    {
        return res.status(401).send({ message: `Failed to fetch transaction. Invalid transaction reference.`})
    }

    return res.status(200).send({ message: `Transaction fetched successfully.`, transaction: transaction })
})

function extractValidationErrorMessages(errors: any): string[] {
    const errorMessages: string[] = [];
    errors = errors.errors
    for (const field in errors) {
        if (Array.isArray(errors[field])) {
        errorMessages.push(...errors[field]);
        }
    }
    
    return errorMessages;
}
    

export default transactionRouter