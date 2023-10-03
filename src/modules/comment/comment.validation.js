import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";
export const creatCommentVal = {
    body: Joi.object().required().keys({
      comment:Joi.string().required().min(5)
    }) ,
    params: Joi.object().required().keys({
      postId:generalFields.id
    }),
    query: Joi.object().required().keys({}),
  };

  export const updateCommentVal = {
    body: Joi.object().required().keys({
      comment:Joi.string().required().min(5)
    }) ,
    params: Joi.object().required().keys({
    commentId:generalFields.id
    }),
    query: Joi.object().required().keys({}),
  };


  export const generalValidation = {
    body: Joi.object().required().keys({ }) ,
    params: Joi.object().required().keys({
    commentId:generalFields.id
    }),
    query: Joi.object().required().keys({}),
  };

