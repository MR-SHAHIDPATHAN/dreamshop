

const Errorhandler = require("../utils/errorhandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const User = require ("../model/userModel.js");
const SendToken = require("../utils/jwtToken.js");
const sendEmail =require("../utils/sendEmail.js")
const cloudinary = require('cloudinary');






// ! Register a User 

exports.registerUser = catchAsyncError( async (req , res , next)=>{

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,  {
    folder:"avatars",
    width:150,
    crop:"scale"
  })




  const {name , email , password } = req.body;

  const user  = await User.create({
    name, email , password ,
    avatar:{
      public_id:myCloud.public_id,
      url:myCloud.secure_url,
    }

  });

  SendToken(user , 201, res);


});


//!LOGIN USER 

exports.loginUser = catchAsyncError(async (req, res , next)=>{

  const { email , password } = req.body;

  //checking if user has given password and email both are filled

  if(!email ||  !password){ // dono bhi hona chahiye
    return next(new Errorhandler ("Please Enter Email and Password", 400));

  }

  const user = await User.findOne({email}).select( "+password") // user searching 

  if(!user){ // user nahi he to 
    return next(new Errorhandler("Invalid emial or Password",401))
  }

  const isPasswordMatched = user.comparePassword(password);
  if(!isPasswordMatched){ // password match  nahi he to 
    return next(new Errorhandler("Invalid emial or Password",401))
  }

  SendToken(user , 200, res);

})


//! logout user

exports.logout = catchAsyncError (async(req, res ,next )=>{


  res.cookie("token" , null, {
    expires:new Date(Date.now()),
    httpOnly:true

  })


  res.status(200).json({
    success:true,
    message:"Logged Out"
  })



})

//! forgot password 

exports.forgotPassword = catchAsyncError(async (req, res , next)=>{

  const user = await User.findOne({email:req.body.email}); // cheking user in database

   if(!user){

    return next(new Errorhandler ("User not found" , 404))

   }

   // Get resetPasswordToken here 
 const resetToken = user.getResetPasswordToken();
 await user.save({validateBeforeSave : false });

// link creating for reset password
 const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`; 

 // creating message for send email 
 const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\nIf you have not requested this email then please it `;

try {

  await sendEmail({

    email:user.email,
    subject:`Ecommerce Password Recovery`,
    message,

  });

  res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`,

  })
  
} catch (error) {

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire =undefined;

 await user.save({validateBeforeSave : false });

   return next( new Errorhandler (error.message, 500)) 
}


})


//! RESET PASSWORD 

exports.resetPassword = catchAsyncError(async (req, res  , next )=>{


  // creating token hash 

  const resetPasswordToken = crypto 
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");


    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt:Date.now()}

    });

    if(!user){
      return next( new Errorhandler ("Reset Password Token is invalid or expired",400 ))
    }

     if(req.body.password !== req.body.confirmPassword ){
      return next( new Errorhandler ("Password does not match",400 ))


     }

     user.password = req.body.password ;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire =undefined;

     await user.save();
     SendToken(user,200,res)

})


//! Get user Details 


exports.getUserDetails = catchAsyncError( async(req, res , next)=>{

  const user = await User.findById(req.user.id);


  res.status(200).json({
    success:true,
    user,
  });

});



//! UPDATE USER PASSWORD

exports.updatePassword = catchAsyncError(async (req, res, next )=>{
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched =  await  user.comparePassword(req.body.oldpassword);

  if(!isPasswordMatched){ // password match  nahi he to 
    return next(new Errorhandler("old password is InCorrect",400))
  }

  if(req.body.newPassword !== req.body.confirmPassword ){
    return next(new Errorhandler("password does not match",400))
  }


  user.password = req.body.newPassword ; 

  await user.save();

  SendToken(user, 200 , res)



});



//! UPDATE USER PROFILE


exports.updateProfile = catchAsyncError(async (req, res, next )=>{
 
  const newUserData = {
    name : req.body.name,
    email:req.body.email,

  }
  // cloudinary here

  if(req.body.avatar !== ""){

    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId)


    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,  {
      folder:"avatars",
      width:150,
      crop:"scale"
    })

    newUserData.avatar  ={
      public_id:myCloud.public_id,
      url:myCloud.secure_url,


    }
  


  }


  const user =  await User.findByIdAndUpdate(req.user.id , newUserData , {
    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
   res.status(200).json({
     success:true,
     message:"Update successfully"
   })

});


//!Get all Users : Admin

exports.getAllUsers = catchAsyncError ( async ( req, res , next )=>{
   
  const users = await User.find();

  res.status(200).json({
    success:true,
    users,
  })

})

//!Get Single User Detail : Admin

exports.getSingleUser = catchAsyncError ( async (req , res , next ) =>{

  const user =   await User.findById(req.params.id); // open user profile and get id

 if(!user){
   return next(new Errorhandler(`User does not exist ${req.params.id}`, 400) )

 }

  res.status(200).json({
    success:true,
    user,
  })

});


//! UPDATE USER ROLE = ADMIN 

exports.updateUserRole = catchAsyncError(async (req, res, next )=>{
 
  const newUserData = {
    name : req.body.name,
    email:req.body.email,
    role:req.body.role,

  }
  
 

    await User.findByIdAndUpdate(req.params.id , newUserData , {
    new:true,
    runValidators:true,
    useFindAndModify:false,
  })

  
   res.status(200).json({
     success:true,
     message:"Update successfully"
   })

});




//! DELETE USER = ADMIN 

exports.deleteUser = catchAsyncError(async (req, res, next )=>{
 


  const user = await User.findByIdAndDelete(req.params.id)
  // we will remove from cloudanry later

  if(!user){
    return next( new Errorhandler(`user does not exist with id ${req.params.id}` , 404))

  }

  const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId)



  await user.remove(); // delete kar do 
 

   res.status(200).json({
     success:true,
     message:"delete successfully"
   })

});

















