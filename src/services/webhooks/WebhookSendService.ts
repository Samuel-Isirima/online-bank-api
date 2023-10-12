import axios from 'axios';

interface WebhookSendServiceInterface 
{
endpoint: string;
webhookType: string;
method: string;
data: any;

sendWebhook(): boolean;
logWebhook(): void;
registerWebhookInDB(): void;
}


class WebhookSendService implements WebhookSendServiceInterface 
{
endpoint!: string;
webhookType!: string;
method!: string;
data!: any;

    constructor(endpoint: string, webhookType: string, method: string, data: any)
    {
    this.endpoint = endpoint
    this.webhookType = webhookType;
    this.method = 'POST';
    this.data = data;
    }

    sendWebhook(): boolean 
    {
        //Send data to endpoint
        axios.post(this.endpoint, this.data)
        .then(response => {
            if (response.status === 200) 
            {
            return true;
            } 
            else 
            {
            return false;
            }
        })
        .catch(error => 
        {
            return false;
        });
        return false;
    }

    logWebhook(): void 
    {
        
    }

    registerWebhookInDB(): void 
    {
        
    }
}