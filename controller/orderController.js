

const Order = require("../model/orderModel.js");
const Errorhandler = require("../utils/errorhandler.js");
const Product = require("../model/productModel.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");


//! Create new Order

exports.newOrder = catchAsyncError (async (req , res , next)=>{


  const { 
        shippingInfo ,
        orderItems ,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;


      const order = await Order.create({
        shippingInfo ,
        orderItems ,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,

      });


      res.status(201).json({
        success:true,
        order,

      })
})


//! Get single Order : admin 

exports.getSingleOrder = catchAsyncError(async( req , res  , next) =>{

  const order = await Order.findById(req.params.id).populate("user", "name email");

 if(!order){
   return next (new Errorhandler("Order not found with this is id", 404))

 }

 res.status(200).json({
   success:true,
   order
 })

  
})


//! Get logged in user Orders :: MY ORDERS

exports.myOrder = catchAsyncError(async( req , res  , next) =>{

  const orders = await Order.find({user:req.user._id})


 res.status(200).json({
   success:true,
   orders
 })

  
})


//! Get ALL ORDERS -- ADMIN 

exports.getAllOrders = catchAsyncError(async( req , res  , next) =>{

  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order)=>{
    totalAmount += order.totalPrice;
  })

 res.status(200).json({
   success:true,
   orders,
   totalAmount,
 })

  
})



//! UPDATE ORDERS  STATUS-- ADMIN 

exports.updateOrder = catchAsyncError(async( req , res  , next) =>{

  const order = await Order.findById(req.params.id);

  
  if(!order){
    return next (new Errorhandler("Order not found with this is id", 404))
 
  }

  if(order.orderStatus === "Delivered"){
    return next ( new Errorhandler("you have allready delivered this order", 400))
  }

  
if(req.body.status === "Shipped"){
  // update the stock 
  order.orderItems.forEach(async (order)=>{
    await updateStock (order.product, order.quantity)

  });

}

  order.orderStatus = req.body.status;
  if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();

  }

 await order.save({validateBeforeSave:false})
 res.status(200).json({
   success:true,
   
 })

  
})


async function updateStock (id , quantity ) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity ;  
  product.save()

}





//! delete Order  ADMIN 

exports.deleteOrder = catchAsyncError(async( req , res  , next) =>{

  const order = await Order.findById(req.params.id);

  if(!order){
    return next (new Errorhandler("Order not found with this is id", 404))
 
  }

 await order.remove();

 res.status(200).json({
   success:true,
 
 })

  
})