interface WebhookServiceInterface 
{
endpoint: string;
webhookType: string;
method: string;

sendWebhook(): boolean;
logWebhook(): void;
registerWebhookInDB(): void;
}


class WebhookService implements WebhookServiceInterface 
{
endpoint!: string;
webhookType!: string;
method!: string;

    constructor(endpoint: string, webhookType: string, method: string)
    {
    this.endpoint = endpoint
    this.webhookType = webhookType;
    this.method = 'POST';
    }

    sendWebhook(): boolean 
    {
        return true;
    }

    logWebhook(): void 
    {
        
    }

    registerWebhookInDB(): void 
    {
        
    }
}