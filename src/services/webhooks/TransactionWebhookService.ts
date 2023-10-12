class TransactionWebhookService extends WebhookService 
{
    constructor(endpoint: string, webhookType: string, method: string)
    {
        super(endpoint, webhookType, method);
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
