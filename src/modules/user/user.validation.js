import Joi from 'joi';
import { generalFields } from '../../middleware/validation.js';
//=============================================update profile val=========================================

export const profileUpdateVal = {
    body: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        lastName: Joi.number(),
        email: Joi.string().email(),
        age: Joi.number().integer().min(0)
    }),
    params: Joi.object().keys({}), // Parameters validation (e.g., route parameters)
    query: Joi.object().keys({}), // Query string validation (e.g., query parameters)
  };
//=============================================comfirm profile val=========================================
  export const comfirmProfileUpdateVal = {
    body: Joi.object().keys({
        code: Joi.string().length(6).required(),
    }),
    params: Joi.object().keys({}), 
    query: Joi.object().keys({}), 
  };
//=============================================add profile pic val=========================================

  export const addProfilePicval = {
    body: Joi.object().keys({}),
    file: generalFields.file.required(),
    params: Joi.object().keys({}),
    query: Joi.object().keys({}), 
  };
//=============================================add cover pics val=========================================
  export const addCoverImagesVal = {
    body: Joi.object().keys({}),
    files:Joi.array().items(generalFields.file).max(5).min(2),
    params: Joi.object().keys({}), 
    query: Joi.object().keys({}), 
  };
  //=============================================update password=========================================
  export const updatePasswordVal = {
    body: Joi.object().keys({
        oldPassword:Joi.string(),
        newPassword:Joi.string()
    }),
    params: Joi.object().keys({}),
    query: Joi.object().keys({}), 
  };