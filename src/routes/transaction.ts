import { Router, Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser';
import User, { UserObjectForCreateUser, UserObjectFromDatabase } from '../models/User'
import RequestValidator from '../helpers/RequestValidator';
import bcrypt from 'bcrypt';
import Transaction from '../models/Transaction';
import UserFinancialAccount from '../models/UserFinancialAccount';
import Debit from '../models/Debit';
import Credit from '../models/Credit';
import { sequelize } from '../database/DatabaseConnection';
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
    const transaction_amount = parseFloat(amount)

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

    //Confirm that the sender account has sufficient balance
    if(senderAccount.account_balance < transaction_amount)
    {
        return res.status(401).send({ message: `Transaction failed. Insufficient balance.`})
    }

    //confirm that the recipient account exists
    let recipientAccount: UserFinancialAccount | null = null
    if(recipient_account_number)
    {
        recipientAccount = await UserFinancialAccount.findOne({ where: { account_number: recipient_account_number } })
    }
    else if(recipient_account_tag)
    {
        recipientAccount = await UserFinancialAccount.findOne({ where: { tag: recipient_account_tag } })
    }
    else
    {
        return res.status(401).send({ message: `Transaction failed. Invalid recipient account.`})
    }

    if(!recipientAccount)
    {
        return res.status(401).send({ message: `Transaction failed. Invalid recipient account.`})
    }

    //Check if the accounts have the same currency
    if(senderAccount.currency !== recipientAccount.currency)
    {
        return res.status(401).send({ message: `Transaction failed. Accounts have different currencies. Please use our currency exchange service.`})
    }

    var transaction: any = await sequelize.transaction()


    //Initiate the transaction

    try
    {

    const debitTransaction = await Debit.create({
        user_account_id: senderAccount.user_id,
        amount: transaction_amount,
        balance_before: senderAccount.account_balance,
        balance_after: senderAccount.account_balance - amount,
        status: 'pending',
        type: 'INTRA',
        destination_account_id: recipientAccount.id,
        destination_account_name: recipientAccount.tag,
    }, { transaction: transaction })


    //Now update sender account
    await UserFinancialAccount.update({account_balance: senderAccount.account_balance - transaction_amount}, { where: { id: senderAccount.id }, transaction: transaction })

    //Now create the credit record for the recipient
    const creditTransaction = await Credit.create({
        user_account_id: recipientAccount.user_id,
        amount: transaction_amount,
        balance_before: recipientAccount.account_balance,
        balance_after: recipientAccount.account_balance + transaction_amount,
        status: 'pending',
        type: 'INTRA',
        source_account_id: senderAccount.id,
        source_account_name: senderAccount.tag,
    }, { transaction: transaction })

    //Now update recipient account
    await UserFinancialAccount.update({account_balance: recipientAccount.account_balance + transaction_amount}, { where: { id: recipientAccount.id }, transaction: transaction })
    
    await transaction.commit()
    
    }
    catch(err)
    {
        await transaction.rollback()
        return res.status(401).send({ message: `Transaction failed. ${err.message}`})
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