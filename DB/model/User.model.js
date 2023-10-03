import mongoose, { Schema, Types, model } from "mongoose";
const userSchema = new Schema({
    fullName: {
        type: String,
        // required: [true, 'firstName is required']
      },
    firstName: {
        type: String,
        // required: [true, 'firstName is required']
      },
      lastName: {
        type: String,
        // required: [true, 'lastName is required']
      },
      email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
      },
      password: {
        type: String,
        required: [true, 'password is required']
      },
      phone: {
        type: String,
        required: true
      },
      age: {
        type: Number
      },
      confirmEmail: {
        type: Boolean,
        default: false
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      code:String,
      profileImage: {type:Object},
      coverImages: { type:Array },
      
    // emailConfirmationToken: String,
}, {
    timestamps: true
})
//=============================================split fullName into first name and last name=========================================
userSchema.pre('save', function (next) {
    const names = this.fullName.split(' ');
    this.firstName = names[0];
    this.lastName = names.slice(1).join(' ');
    next();
  });
const userModel = model('User', userSchema)
export default userModel




