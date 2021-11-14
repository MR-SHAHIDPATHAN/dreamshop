
const app = require('./app.js');



const cloudinary = require('cloudinary');
const connectDatabase = require("./config/database.js")



// handling uncaught exception Error 

process.on("uncaughtException" , (err)=>{
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception Error `);
  process.exit(1)
})





//config
if(process.env.NODE_ENV !== "PRODUCTION"){

  require("dotenv").config({path:"config/config.env"});
}

// connecting to databse 
connectDatabase();

// cloudinary config 

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET
})

const server = app .listen(process.env.PORT , ()=>{
  console.log(`server start ${process.env.PORT}`);
})



// Unhandle Promise Rejection Error

process.on("unhandledRejection", err =>{
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandlePromiseRejection error`);
  server.close(()=>{
    process.exit(1)
  })

})

