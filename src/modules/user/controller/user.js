import userModel from "../../../../DB/model/User.model.js"
import { AppError } from "../../../utils/AppError.js"
import { compare, hash } from "../../../utils/HashAndCompare.js"
import sendEmail from "../../../utils/email.js"
import { nanoid } from "nanoid"
import cloudinary from "../../../utils/cloudinary.js"
//=============================================getUserProfile=========================================
export const getUserProfile=async(req,res,next)=>{
  const getUser=await userModel.findById(req.user._id).select("-password -confirmEmail -isDeleted -emailConfirmationToken -code -__v")
   res.json({message:"done",getUser});
}
//=============================================updateProfile=========================================
export const updateProfile=async(req,res,next)=> {

    const updatedProfileData = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return next(new AppError("User not found",404))
    }

    // Check if the email is being updated
    if (updatedProfileData.email && updatedProfileData.email !== user.email) {
      // Generate a new email confirmation code
      const newEmailConfirmCode = nanoid(6);
      // Set confirmedEmail to false
      user.confirmEmail = false;
      // Save the new email confirmation code to the user's document
      user.code = newEmailConfirmCode;
      // Send a confirmation email to the new email address
      user.email = updatedProfileData.email;
      await sendEmail({
        to: updatedProfileData.email,
        subject: 'Confirm Your New Email Address',
        text: `Your confirmation code: ${newEmailConfirmCode}`,
      });
    }
    //migrate user obejct and updatedProfileData object togther
    if (updatedProfileData.firstName) {
      user.firstName = "updatedProfileData.firstName";
    }
  
    if (updatedProfileData.lastName) {
      user.lastName = updatedProfileData.lastName;
    }
  
    if (updatedProfileData.age) {
      user.age = updatedProfileData.age;
    }
    await user.save();
    console.log(user.age)
    res.json({ message: 'Profile updated successfully' });

};
export const updateProfileComfirmation=async (req, res) => {
    const confirmationCode = req.body.code; 

    const user = await userModel.findOne({ code: confirmationCode });

    if (!user) {
      return next(new AppError("Invalid confirmation code",404))
    }
    // Update the user's profile to confirm the new email address
    user.confirmEmail = true;
    user.code = nanoid(6);

    await user.save();
    // Send a response indicating successful email confirmation
    res.json({ message: 'Email address confirmed successfully' });

};
//=============================================addProifile pic=========================================
export const addProfilePic = async (req, res, next) => {
    const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`socialMedia/Images/user/${req.user.firstName}/profile`})
   await userModel.findByIdAndUpdate(req.user.id, {
      profileImage: {secure_url,public_id},
    });
    res.json({ message: "picture is successfuly added to your profile" });

};
//=============================================addcover pics=========================================
export const addCoverImages=async (req, res,next) => {
  
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found",404))
    }
    const newCoverPictures = [];
    for (const file of req.files) {
      const  {public_id,secure_url} = await cloudinary.uploader.upload(file.path, {
        public_id: `socialMedia/cover_pictures/user/${req.user.firtname}`,
      });
      newCoverPictures.push( {public_id,secure_url});
    }
    const allCoverPictures = [...user.coverImages, ...newCoverPictures];

    user.coverImages = allCoverPictures;
    await user.save();

    res.json({ message: 'Cover pictures added successfully', coverPictures: allCoverPictures });

}
//=============================================update password=========================================
export const updatePassword=async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new AppError("User not found",404))
    }

    const passwordMatch =compare({plaintext:oldPassword,hashValue: user.password});
    if (!passwordMatch) {
      return next(new AppError('Old password is incorrect', { cause: 400 }));
    }
    if (oldPassword === newPassword) {
      return next(new AppError('New password must be different from the old password', { cause: 400 }));
    }
    // Hash the new password
    const hashedNewPassword = hash({plaintext:newPassword});
    // Update the user's password with the new hashed password
    user.password = hashedNewPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  }
//=============================================softDelete=========================================
export const softDeleteHandler=async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError('User not found',404 ));
  }
  if (user._id.toString() !== userId.toString()) {
    return next(new AppError("You are not authorized to perform this action",403))

  }
  user.isDeleted = true;
  await user.save();
  res.json({ message: 'Profile soft deleted successfully' });
}