import { Router } from "express";
import * as userController from "./controller/user.js";
import auth from "../../middleware/auth.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { addCoverImagesVal, addProfilePicval, comfirmProfileUpdateVal, profileUpdateVal, updatePasswordVal } from "./user.validation.js";
const router = Router()
//=============================================getUserProfile=========================================
router.get('/',auth,userController.getUserProfile)
//=============================================update profile=========================================

router.post('/update-profile',validation(profileUpdateVal),auth,userController.updateProfile)
router.put('/comfirm-profileupdate',validation(comfirmProfileUpdateVal),auth,userController.updateProfileComfirmation)
//=============================================add profile pic=========================================
router.put("/addprofilepic", auth, fileUpload(fileValidation.image).single('image'),validation(addProfilePicval),userController.addProfilePic);
//=============================================add cover images=========================================
router.put("/add-cover-pictures", auth, fileUpload(fileValidation.image).array('images'),validation(addCoverImagesVal),userController.addCoverImages);
//=============================================update password=========================================
router.put("/update-password", validation(updatePasswordVal),auth,userController.updatePassword);
//=============================================soft delete=========================================
router.delete("/soft-delete",auth,userController.softDeleteHandler);


export default router