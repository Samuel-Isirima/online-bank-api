import Validator from "validatorjs";

const RequestValidator = async (body, rules, customMessages) => {
    return new Promise((resolve, reject) => {
      const validation = new Validator(body, rules, customMessages);
      validation.passes(() => resolve({status: true}));
      validation.fails(() => resolve({status: false, errors: validation.errors})); // Resolve with false in case of validation failure
    });
}
export default RequestValidator;  