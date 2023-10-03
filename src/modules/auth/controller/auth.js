import { StatusCodes } from "http-status-codes"
import userModel from "../../../../DB/model/User.model.js"
import { AppError } from "../../../utils/AppError.js"
import { Encryption } from "../../../utils/Encryption.js"
import { compare, hash } from "../../../utils/HashAndCompare.js"
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js"
import sendEmail from "../../../utils/email.js"
import { nanoid } from "nanoid"
import { emailVerificationTamplete, forgetPasswordTamplete } from "../../../utils/HtmlVerivicationCode.js"
import jwt from 'jsonwebtoken';


//=============================================signUp==========================================
export const registeration=async(req,res,next)=>{
    const FindEmail=await userModel.findOne({email:req.body.email})
    if(FindEmail){
        return next(new AppError("email is already exist",StatusCodes.BAD_REQUEST))
    }
    let phoneEncryption
    if(req.body.phone){
        phoneEncryption  =Encryption({encData:req.body.phone})
    }
    const hashedPassword = hash({plaintext:req.body.password})
    const newUser = {
        fullName:req.body.fullName,
        email:req.body.email,
        password: hashedPassword,
      };

      if (phoneEncryption) {
        newUser.phone = phoneEncryption;
      }
      if(req.body.age){
        newUser.age=req.body.age
      }
      const user = new userModel(newUser);
      await user.save();
      const emailConfirmationToken = generateToken({payload:{id:user._id},expiresIn:"1m "}); 
      const confirmationLink = `http://localhost:5000/auth/confirm/${emailConfirmationToken}/${user._id}`;
      await sendEmail({ to: req.body.email, html: emailVerificationTamplete(confirmationLink),subject:"ComfrimEmail" })
      res.json({ success: true, message: 'Registration successful. Please check your email for confirmation.' });

}
//=============================================comfirm email===================================

export const comfirmEmail=async(req,res,next)=>{
    const userId=req.params.userId
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
      if (!decoded?.id) {
        return res.json({ message: "In-valid token payload" })
    }
      // Find the user with the confirmation token
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return next(new AppError("Invalid confirmation token",404))
      }
  
      // Mark the email as confirmed and clear the token
      user.confirmEmail = true;
      // user.emailConfirmationToken = null;
      await user.save();
      return res.send(`<div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
      <h2 style="color: #008000;">Email Successfully Verified</h2>
      <p style="color: #333;">Your email has been successfully verified. Thank you!</p>
    </div>`)

    }catch (err) {
      const findUser = await userModel.findById(userId);
      const emailConfirmationToken = generateToken({payload:{id:findUser._id},expiresIn:"5d "}); 
      if (err.name == "TokenExpiredError" && !findUser.confirmEmail) {
        return res.send(` <div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
      <h2 style="color: #FF0000;">Email Verification Link Expired</h2>
      <p style="color: #333;">Your email verification link has expired.</p>
      <p style="color: #333;">please click link below to comfirm email again:</p>
      <div style="text-align: center; background-color: #f2f2f2; padding: 5px;">
        <p style="color: #333;">
        Click this <a href="http://localhost:5000/auth/confirm/${emailConfirmationToken}/${findUser._id}" style="color: #008000; text-decoration: none; font-weight: bold;">link</a> to unsubscribe.
        </p>
      </div>
      <p style="color: #333;">Alternatively, you can register again with the same email address to receive a new verification link.</p>
    </div>`);
      }
  
      return res.send(
        "<h2 style='color: green; text-align: center ;margin-top:100px '> you're already verify your email!!</h2>  "
      );
    }
  };

 //=============================================Login===========================================
 export const signIn=async(req,res,next)=>{
  const user=await userModel.findOne({email:req.body.email})
  if(!user){
    return next(new AppError("invalid user information ",StatusCodes.BAD_REQUEST))
  }
  const match=compare({plaintext:req.body.password,hashValue:user.password})
  // console.log(typeof req.body.password)
  if(!match){
    return next(new AppError("invalid user information",StatusCodes.BAD_REQUEST))
  }
  const token=generateToken({payload:{id:user._id,email:user.email}})
  return res.status(StatusCodes.OK).json({message:"Done",token})
}

 //=============================================forgetPassword===========================================
 export const sendEmailPinforgetPassword=async(req,res,next)=>{
  const {email}=req.body
  const user=await userModel.findOne({email})
  // if(!user){
  //   return next(new AppError("user not found",StatusCodes.BAD_REQUEST))
    
  // }
  // const generateNewCode=nanoid(6)
  // user.code=generateNewCode
  // await sendEmail({ to: user.email, html: forgetPasswordTamplete(generateNewCode),subject:"forgetPassword" })
  // await user.save()
  // return res.json({message:"Done"})
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
    
  if (!user) {
    return next(new AppError("User not found", StatusCodes.BAD_REQUEST));
  }
  const pinCode = nanoid(6);

  const token = jwt.sign({ userId: user._id, code: pinCode }, process.env.TOKEN_SIGNATURE, { expiresIn: '2m' });

  await sendEmail({ to: user.email, html: forgetPasswordTamplete(token), subject: "Forget Password" });

  return res.json({ message: "Token sent successfully" });





}
export const forgetPassword=async(req,res,next)=>{
  const {email,code}=req.body
  const user=await userModel.findOne({email})
  // if(!user){
  //   return next(new AppError("user not found",StatusCodes.BAD_REQUEST))
  // }
  // if(code!=user.code){
  //   return next(new AppError("invalid code",StatusCodes.BAD_REQUEST))

  // } 
  // const generateNewCode=nanoid(6)
  // req.body.newPassword= hash({plaintext:req.body.newPassword})
  // const changePassword=await userModel.updateOne({_id:user._id},{code:generateNewCode,password:req.body.newPassword})
  // return res.json({message:"Done",changePassword})
  //////////////////////////////////////////////////////////////////////////////////////////////
  if (!user) {
    return next(new AppError("User not found", StatusCodes.BAD_REQUEST));
  }
  jwt.verify(code, process.env.TOKEN_SIGNATURE , async (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid or expired code", StatusCodes.BAD_REQUEST));
    }

    const hashedPassword = hash({plaintext:req.body.newPassword});
    user.password = hashedPassword;

    await user.save();

    return res.json({ message: "Password changed successfully" });
  });
}