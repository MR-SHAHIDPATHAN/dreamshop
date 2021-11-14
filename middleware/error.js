const Errorhandler = require("../utils/errorhandler.js");

module.exports = (err , req , res , next) =>{
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error"



  // wrong mongodb Id error 
  if(err.name === "CastError"){
    const message = `Resorce not found. Invalid:${err.path}`;
    err = new Errorhandler(message, 400)
  }


  // mongooose duplicate key error 

  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new Errorhandler(message, 400)

  }
  
  // Wrong jwt error 
  if(err.name === "JsonWebTokenError"){
    const message = `Json web token is invalid , try again later`
    err = new Errorhandler(message, 400)

  }
  
  // jwt expire error 
  if(err.name === "TokenExpiredError"){
    const message = `Json web token is Expired , try again later`
    err = new Errorhandler(message, 400)

  }



  res.status(err.statusCode).json({
    success:false,
    message : err.message
  })

}