import axios from 'axios';
import Bank from '../models/Bank';

interface InterBankTransactionPublishServiceInterface 
{
bank_transaction_endpoint: string;
bank_secret_key: string;
bank_api_key: string;
bank_name: string;
bank_transaction_type: string;
transaction_data: any;
/**
 * 
 * Transaction data format
 * {
 * "amount": 1000,
 * "currency": "NGN",
 * "recipient_account_number": "1234567890",
 * "sender_account_number": "0987654321",
 * "sender_account_name": "Samuel Doe",
 * "sender_bank_name": "bank1",
 * "recipient_bank_name": "bank2",
 * "recipient_account_name": "John Doe",
 * "transaction_type": "interbank",
 * "transaction_description": "Transfer from bank1 to bank2",
 * "transaction_reference": "1234567890",
 * "transaction_date": "2020-01-01 12:00:00"
 * }
 * 
 */


publishTransaction(): Promise<boolean>;
logTransaction(): void;
}


class InterBankTransactionPublishService implements InterBankTransactionPublishServiceInterface 
{
bank_transaction_endpoint!: string;
bank_secret_key!: string;
bank_api_key!: string;
bank_name!: string;
bank_transaction_type!: string;
transaction_data!: any;

   //Create a constructor
    constructor(bank_transaction_endpoint: string, bank: Bank, transaction_data: any)
    {
    this.bank_transaction_endpoint = bank.transaction_endpoint;
    this.bank_secret_key = bank.secret_key;
    this.bank_api_key = bank.api_key;
    this.bank_name = bank.name;
    this.bank_transaction_type = 'interbank';
    this.transaction_data = transaction_data;
    }


    async publishTransaction(): Promise<boolean> 
    {
        //Send data to endpoint with authorization and secret key and return true or false
        const response: boolean = await axios.post(this.bank_transaction_endpoint, this.transaction_data, {
            headers: {
                'Authorization': this.bank_api_key,
                'Secret': this.bank_secret_key
            }
        }).then(response => {
            if (response.status === 200) 
            {
            return true;
            } 
            else 
            {
            return false;
            }
        }).catch(error =>
        {
            return false;
        })

        return response
       
    }

    logTransaction(): void 
    {
        
    }
}