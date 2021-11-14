

const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto") // for reseting password functionality 





const UserSchema = new mongoose.Schema({

  name:{
    type:String,
    required:[true,"Please Enter Your Name"],
    maxlength:[30,"Name cannot exceed 30 characters"],
    minlength:[4,"Name should have more than 4 characters"]
  },

  email:{
    type:String,
    required:[true, "Please Enter Your Email"],
    unique:true,
    validate:[validator.isEmail , "Please Enter a valid Email"]
  },
  password :{
    type:String,
    required:[true, "Please Enter Your Password"],
    minlength:[8,"Password should be greate than 8 character"],
    select:false // koi bhi query karne par password fetch disable 
  },

  avatar:
    {
      public_id:{
      type:String,
      required:true
    },


    url:{
      type:String,
      required:true
    
   }

  },

  role:{
    type:String,
    default:"user",

  },

  createdAt:{
    type:Date,
    default:Date.now,

  },

  resetPasswordToken:String,
  resetPasswordExpire:Date,

});



// ! password hash done 

UserSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next();

  }

  this.password = await bcrypt.hash(this.password, 10)

})

//! JWT TOKEN GENERATING 

UserSchema.methods.getJWTToken = function(){
  return jwt.sign({id:this._id} , process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE,
  })
};


//!compare password 

UserSchema.methods.comparePassword = async function(password){

  return await bcrypt.compare(password , this.password);

}

//! Reset password features 

UserSchema.methods.getResetPasswordToken = function(){

  // Generating token here 

  const resetToken = crypto.randomBytes(20).toString("hex"); // buffer value to string 

  // hashing and adding to userSchema 
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 15*60*1000; // 15 minutes me expire ho jayega token 
  return resetToken;


}




module.exports = mongoose.model("User", UserSchema)