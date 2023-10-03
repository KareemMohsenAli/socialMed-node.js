import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as postController from "./controller/post.js"
import { addPostVal, globalVlidationforPosts, likePostVal, updatePostVal, updatePrivacyVal } from "./post.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()


router.post('/addpost',
 auth,
 fileUpload(fileValidation.videoImages).fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]),
 validation(addPostVal),
 asyncHandler( postController.creatPost)

)

router.put('/updatepost/:postId',
 auth,
 fileUpload(fileValidation.videoImages).fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]),
 validation(updatePostVal),
 asyncHandler( postController.updatePost)

)

router.delete('/deletepost/:postId',
 auth,
 validation(globalVlidationforPosts),
 asyncHandler( postController.deletePost)
)



router.post('/likepost/:postId',
 auth,
 validation(likePostVal),
 asyncHandler( postController.likePost)
)


router.get("/getposts",auth,asyncHandler(postController.getPosts))

router.get("/getpost/:postId",auth,validation(globalVlidationforPosts),asyncHandler(postController.getPost))



router.post('/unlike/:postId',
 auth,
 validation(likePostVal),
 asyncHandler( postController.unLike)
)


router.patch('/updateprivacy/:postId',
 auth,
 validation(updatePrivacyVal),
 asyncHandler(postController.updatePrivacy)
)

router.get('/yestardayposts/',
 auth,
 asyncHandler(postController.yesterdayPosts)
)

router.get('/todayposts/',
 auth,
 asyncHandler(postController.getPostsCreatedToday)
)


router.get('/getpostapiFeature',postController.ApiFeaturesHandeling)





export default router