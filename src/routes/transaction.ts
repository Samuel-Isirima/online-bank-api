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
    const debitRef = generateTransactionRef(30)
    const creditRef = generateTransactionRef(30)
    const transactionRef = generateTransactionRef(30)


    const debitTransaction = await Debit.create({
        user_account_id: senderAccount.user_id,
        amount: transaction_amount,
        balance_before: senderAccount.account_balance,
        balance_after: senderAccount.account_balance - amount,
        status: 'pending',
        type: 'INTRA',
        destination_account_id: recipientAccount.id,
        destination_account_name: recipientAccount.tag,
        reference: debitRef,
        transaction_id: transactionRef
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
        reference: creditRef,
        transaction_id: transactionRef
    }, { transaction: transaction })

    //Now create the update the transaction record

    //Now update recipient account
    await UserFinancialAccount.update({account_balance: recipientAccount.account_balance + transaction_amount}, { where: { id: recipientAccount.id }, transaction: transaction })
    
    await transaction.commit()
    
    }
    catch(err: any)
    {
        await transaction.rollback()
        return res.status(401).send({ message: `Transaction failed. ${err.message}`})
    }
    

   
})


transactionRouter.post('/send/inter', bodyParser.urlencoded(), async(req: Request, res: Response, next: NextFunction) => 
{
    const validationRule = {
        "amount": "required|number|min:20",
        "recipient_account_number": "required|string",
        "recipient_account_bank": "required|string",
        "recipient_account_name": "required|string",
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
    const debitRef = generateTransactionRef(30)
    const creditRef = generateTransactionRef(30)
    const transactionRef = generateTransactionRef(30)


    //Deconstruct the payload
    const { amount, sender_account_id, recipient_account_number, recipient_account_name, recipient_account_bank } = payload
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
        destination_account_name: recipient_account_name,
        destination_account_bank: recipient_account_bank,
        destination_account_number: recipient_account_number,
        reference: debitRef,
        transaction_id: transactionRef
    }, { transaction: transaction })


    //Now update sender account
    await UserFinancialAccount.update({account_balance: senderAccount.account_balance - transaction_amount}, { where: { id: senderAccount.id }, transaction: transaction })

    await transaction.commit()

    //Now send the data to the endpoint of the recipient's bank
    // const recipientBank = await Bank.findOne({ where: { name: recipient_account_bank } })
    // if(!recipientBank)
    // {
    //     return res.status(401).send({ message: `Transaction failed. Invalid recipient bank.`})
    // }
    // const recipientBankEndpoint = recipientBank.endpoint
    // const recipientBankSecret = recipientBank.secret
    // const recipientBankPublicKey = recipientBank.public_key
    // const recipientBankName = recipientBank.name
    // const recipientBankId = recipientBank.id
    var transactionData = {
    amount: transaction_amount,
    sender_account_name: senderAccount.tag,
    sender_account_bank: 'Online Bank API',
    sender_account_number: senderAccount.account_number,
    transaction_id: transactionRef,
    }

    }
    catch(err: any)
    {
        await transaction.rollback()
        return res.status(401).send({ message: `Transaction failed. ${err.message}`})
    }
    

   
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

    if(transaction.credit_record_id)
    {
        const creditRecord = await Credit.findOne({ where: { id: transaction.credit_record_id } })
        if(!creditRecord)
        {
            return res.status(401).send({ message: `Failed to fetch transaction. Invalid transaction reference.`})
        }

        return res.status(200).send({ message: `Transaction fetched successfully.`, transaction: creditRecord })
    }
    else if(transaction.debit_record_id)
    {
        const debitRecord = await Debit.findOne({ where: { id: transaction.debit_record_id } })
        if(!debitRecord)
        {
            return res.status(401).send({ message: `Failed to fetch transaction. Invalid transaction reference.`})
        }

        return res.status(200).send({ message: `Transaction fetched successfully.`, transaction: debitRecord })
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


// program to generate random strings

// declare all characters
const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateTransactionRef(length) : string
{
    let result : string = '';
    const charactersLength: number = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
    

export default transactionRouter