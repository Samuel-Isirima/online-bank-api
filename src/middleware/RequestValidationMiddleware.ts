import { Request, Response } from "express";

import RequestValidator from "../helpers/RequestValidator";

const RegisterValidation = async (req: Request, res: Response, next: any) => {
    const validationRule = {
        "email": "required|string|email",
        "username": "required|string",
        "phone": "required|string",
        "password": "required|string|min:6|confirmed",
        "gender": "string"
    };


await RequestValidator(req.body, validationRule, {}, (err: any, status: any) => 
{
    if (!status) {
        res.status(412)
            .send({
                success: false,
                message: 'Validation failed',
                data: err
            });
    } else {
        next();
    }
}).catch( err => console.log(err))


}
module.exports = 
{
RegisterValidation
};
