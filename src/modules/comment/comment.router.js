import { Router } from "express";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as commentController from "./contoller/comment.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { creatCommentVal, generalValidation, updateCommentVal } from "./comment.validation.js";
const router = Router()

router.post("/addcomment/:postId",validation(creatCommentVal),auth,asyncHandler(commentController.createComment))

router.put("/updatecomment/:commentId",validation(updateCommentVal),auth,asyncHandler(commentController.updateComment))

router.delete("/deletecomment/:commentId",validation(generalValidation),auth,asyncHandler(commentController.deleteComment))


router.post('/likecomment/:commentId',
 auth,
 validation(generalValidation),
 asyncHandler( commentController.likeComment)
)


router.post('/unlikecomment/:commentId',
 auth,
 validation(generalValidation),
 asyncHandler( commentController.unLikeComment)
)

export default router