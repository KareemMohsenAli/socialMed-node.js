import { Router } from "express";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as commentController from "./contoller/replyComment.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { creatReplyCommentVal, generalValidation, updateReplyCommentVal } from "./replyComment.validation.js";
const router = Router()

router.post("/addreplycomment/:commentId",validation(creatReplyCommentVal),auth,asyncHandler(commentController.createReplyComment))

router.put("/updatereplycomment/:commentId",validation(updateReplyCommentVal),auth,asyncHandler(commentController.updateReplyComment))

router.delete("/deletereplycomment/:commentId",validation(generalValidation),auth,asyncHandler(commentController.deleteComment))


router.post('/likecomment/:commentId',
 auth,
 validation(generalValidation),
 asyncHandler( commentController.likeReplyComment)
)


router.post('/unlikecomment/:commentId',
 auth,
 validation(generalValidation),
 asyncHandler( commentController.unLikeReplyComment)
)

export default router