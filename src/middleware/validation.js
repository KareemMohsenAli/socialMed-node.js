import joi from 'joi'
import { Types } from 'mongoose'
const dataMethods = ["body", 'params', 'query', 'headers', 'file','files']

const validateObjectId = (value, helper) => {
    console.log({ value });
    console.log(helper);
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId')
}
export const generalFields = {

    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net'] }
    }).required(),
    password: joi.string(),
    cPassword: joi.string().required(),
    id: joi.string().custom(validateObjectId).required(),
    name: joi.string().required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}

export const validation = (schema) => {
    return (req, res, next) => {
        console.log({ body: req.body });
        const validationErr = []
        dataMethods.forEach(key => {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationErr.push(validationResult.error)
                }
            }
        });

        if (validationErr.length) {
            const validationSimplification = validationErr.reduce((acc, error) => {
                error.details.forEach((detail) => {
                  acc[detail.path[0]] = detail.message;
                });
                return acc;
              }, {});
            
            return res.status(400).json({ message: "Validation Err", validationSimplification })
        }
        return next()
    }
}