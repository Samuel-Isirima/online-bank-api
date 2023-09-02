import Validator from "validatorjs";

const RequestValidator: any = async (body: any, rules: any, customMessages: any, callback: any): Promise<void> => 
{
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

export default RequestValidator;