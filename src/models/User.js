import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true, unique:true},
    password: {type:String, required:true},
    role:{ type:String, enum:["admin","viewer"],default:"viewer"},
    profileImage: { type: String },

    // The refreshToken field is used to store a token that can be used to obtain a new access token
    // when the current one expires.
    refreshToken: { type: String },

    // The passwordResetToken field is used to store a token that can be sent to the user's email
    // for password reset purposes.
    passwordResetToken: { type: String },

    //The passwordResetExpires field is used to store the expiration time of the password reset token.
    passwordResetExpires: { type: Date },
    
},{timestamps:true});

const User = mongoose.model("User",userSchema);
export default User;