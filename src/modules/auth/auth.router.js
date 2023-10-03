import { Router } from "express";
import * as authController from "./controller/auth.js";
import { validation } from "../../middleware/validation.js";
import { RegisterationVal, comfirmEmailVal, forgetPasswordVal, loginValidationSchema, sendEmailPinforgetPasswordVal } from "./auth.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";

const router = Router()
//=============================================signUp=========================================
router.post('/signup',validation(RegisterationVal),asyncHandler(authController.registeration) )
//=============================================comfirmEmail=========================================
router.get('/confirm/:token/:userId',validation(comfirmEmailVal),asyncHandler(authController.comfirmEmail ))
//=============================================login=========================================
router.post("/signin",validation(loginValidationSchema),asyncHandler(authController.signIn))
//=============================================forgetPassword=========================================
router.patch("/sendemailpin",validation(sendEmailPinforgetPasswordVal),asyncHandler(authController.sendEmailPinforgetPassword))
router.patch("/forgetpassword",validation(forgetPasswordVal),authController.forgetPassword)

export default router
