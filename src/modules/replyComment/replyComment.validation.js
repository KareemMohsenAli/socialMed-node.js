import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";
export const creatReplyCommentVal = {
    body: Joi.object().required().keys({
      comment:Joi.string().required().min(5)
    }) ,
    params: Joi.object().required().keys({
      commentId:generalFields.id
    }),
    query: Joi.object().required().keys({}),
  };

  export const updateReplyCommentVal = {
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

