

const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// const errorMiddleware = require("./middleware/error.js")
const path = require('path');


//config
if(process.env.NODE_ENV !== "PRODUCTION"){

  require("dotenv").config({path:"config/config.env"});
}



app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload());

// routes import 
const prodcuct = require("./routes/productRoute.js");
const errorMiddleware = require("./middleware/error.js")
const user = require("./routes/userRoutes.js");
const order = require ("./routes/orderRoute.js")
const payment = require ("./routes/paymentRoute.js")



// api's imported 
app.use("/api/v1", prodcuct);
app.use("/api/v1" , user)
app.use("/api/v1" , order)
app.use("/api/v1" , payment)

app.use(express.static(path.join(__dirname,"../backend/client/build")));
// console.log((path.join(__dirname,"../backend/client/build")));
app.get("*",(req ,res)=>{
  res.sendFile(path.resolve(__dirname,"../backend/client/build/index.html"))

})






// midlleware for error 
app.use(errorMiddleware)




module.exports = app;