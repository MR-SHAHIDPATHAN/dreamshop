const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require ("../model/userModel.js");




exports.isAuthenticateUser = catchAsyncError(async(req, res ,next)=>{

  const {token} = req.cookies;  // cheking token in cookies 
  // console.log(token);

  if(!token){
    return next(new Errorhandler ("Please log in and access this page" , 401));

  }

  const decodedData = jwt.verify(token,process.env.JWT_SECRET); // token verify 
 req.user =  await User.findById(decodedData.id)
 next();

});


exports.authorizeRoles = (...roles) =>{ // admin he n
  return (req,res , next ) =>{
    if(!roles.includes(req.user.role)){ // agar admin nahi he to 

     return next(
        new Errorhandler (`Role: ${req.user.role} is not allowd to access this page `, 403

        ));

    }; 

    next();
  }
}