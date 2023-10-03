import Joi from 'joi';
import { generalFields } from '../../middleware/validation.js';
//=============================================signUp=========================================

export const RegisterationVal = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    // lastName: Joi.string().required(),
    email:generalFields.email,
    password: Joi.string().min(6).required(), // Adjust the password requirements as needed
    phone: Joi.string(), // You can add specific validation for phone numbers here
    age: Joi.number().integer().min(0),
    confirmEmail: Joi.boolean().default(false), // Optional field, default to false
    isDeleted: Joi.boolean().default(false), // Optional field, default to false
    // Add more fields as needed
  }),
  params: Joi.object().keys({}), // Parameters validation (e.g., route parameters)
  query: Joi.object().keys({}), // Query string validation (e.g., query parameters)
};
//=============================================login=========================================

export const loginValidationSchema = {

  body: Joi.object().keys({
  email: generalFields.email,
  password: Joi.string().required(),
  }),
  params: Joi.object().keys({}), // Parameters validation (e.g., route parameters)
  query: Joi.object().keys({}),

};
//=============================================comfirmEmail=========================================

export const comfirmEmailVal = {
  body: Joi.object().keys({}),
    params: Joi.object().keys({
      token: Joi.string().required(),
      userId: Joi.string().required(),
    }), 
    query: Joi.object().keys({}),
};
//=============================================forgetPassword=========================================

export const forgetPasswordVal = {
  body: Joi.object().keys({
    email: generalFields.email,
    code: Joi.string().required(),
    newPassword: Joi.string().required()
    }),
    params: Joi.object().keys({}), 
    query: Joi.object().keys({}),
};
export const sendEmailPinforgetPasswordVal = {
  body: Joi.object().keys({
    email: generalFields.email,
    }),
    params: Joi.object().keys({}), // Parameters validation (e.g., route parameters)
    query: Joi.object().keys({}),
};

