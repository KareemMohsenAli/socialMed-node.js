import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";
const privacyEnum = ['public', 'only me'];
export const addPostVal = {
    body: Joi.object().required().keys({
      content:Joi.string().required(),
      privacy: Joi.string().valid(...privacyEnum).default('public')
    }) ,
    files: Joi.object().required().keys({
      
        images: Joi.array().items(generalFields.file).max(5).min(2),
        video: Joi.array()
        .items(
          generalFields.file
        ) .max(1),
    
    }),
    params: Joi.object().required().keys({}),
    query: Joi.object().required().keys({}),
  };


  export const updatePostVal = {
    body: Joi.object().required().keys({
      content:Joi.string(),
    }) ,
    files: Joi.object().required().keys({
      
        images: Joi.array().items(generalFields.file).max(5).min(2),
        video: Joi.array()
        .items(
          generalFields.file
        ) .max(1),
    
    }),
    params: Joi.object().required().keys({
      postId:generalFields.id
    }),
    query: Joi.object().required().keys({}),
  };


  export const globalVlidationforPosts = {
    body: Joi.object().required().keys({}) ,
    params: Joi.object().required().keys({
      postId:generalFields.id
    }),
    query: Joi.object().required().keys({}),
  };


  export const likePostVal = {
    body: Joi.object().required().keys({}) ,
    params: Joi.object().required().keys({
      postId:generalFields.id
    }),
    query: Joi.object().required().keys({}),
  };


  export const updatePrivacyVal = {
    body: Joi.object().required().keys({
      privacy: Joi.string().valid(...privacyEnum).default('public')
    }) ,
    params: Joi.object().required().keys({
      postId:generalFields.id
    }),
    query: Joi.object().required().keys({}),
  };
