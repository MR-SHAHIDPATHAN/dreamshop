
const Product = require("../model/productModel.js");
const Errorhandler = require("../utils/errorhandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const ApiFeatures = require("../utils/apifeatures.js");
const cloudinary = require("cloudinary")



//!create product :: admin 


exports.createProduct = catchAsyncError(async (req,res,next) =>{

  let images = [];

  if(typeof req.body.images === "string"){
    images.push(req.body.images)

  }else{
    images = req.body.images;

  }

const imagesLink = [];

for (let i = 0; i < images.length; i++) {
  
  const result= await cloudinary.v2.uploader.upload(images[i] , {
    folder:"products"
  })

  imagesLink.push({
    public_id:result.public_id,
    url:result.secure_url,
  })
  
}
  req.body.images = imagesLink;
  req.body.user = req.user.id;


  const product = await Product.create(req.body); 
  res.status(201).json({
    success:true,
    product

  });

});

//! Get all products :: users

exports.getAllProducts = catchAsyncError( async (req, res , next ) =>{
  
  const resultPerPage =8;
  const productsCount = await Product.countDocuments();
  const apifeatures = new ApiFeatures(Product.find(), req.query)
  .search()
  .filter()
  .pagination(resultPerPage);


  const products =  await apifeatures.query;
  res.status(200).json({
    success:true,
    products,
    productsCount,
    resultPerPage,

  })

});


//! Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});   



//! Get single product details 

exports.getProductDetails = catchAsyncError( async (req, res , next )=>{

  const product =  await Product.findById(req.params.id);

  if(!product){
     return next(Errorhandler("product not found",404));
  }


     res.status(200).json({
      success:true,
      product

    })



});


//! Update Products :: admin

exports.updateProduct= catchAsyncError( async (req , res, next) =>{
  
  let product =  await Product.findById(req.params.id);
  
  if(!product){
    return next(Errorhandler("product not found",500));
 }

 // images updating cloudinary here 
 let images = [];

 if(typeof req.body.images === "string"){
   images.push(req.body.images)

 }else{
   images = req.body.images;

 }

 // deleting images 
 if( images !== undefined ){
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
       
     }


     
const imagesLink = [];

for (let i = 0; i < images.length; i++) {
  
  const result= await cloudinary.v2.uploader.upload(images[i] , {
    folder:"products"
  })

  imagesLink.push({
    public_id:result.public_id,
    url:result.secure_url,
  })
  
}
req.body.images = imagesLink;



 }



  product = await Product.findByIdAndUpdate(req.params.id , req.body , { 
        new:true , 
        runValidators:true , 
        useFindAndModify:false
    });

    res.status(200).json({
      success:true,
      product
    })

  
});


//! Delete products

exports.deleteProduct = catchAsyncError( async (req , res , next) =>{

  const product =  await Product.findById(req.params.id);

  
  if(!product){
    return next(Errorhandler("product not found",500));
 }

 // remove images  from cloudinary 

 for (let i = 0; i < product.images.length; i++) {
   

await cloudinary.v2.uploader.destroy(product.images[i].public_id);
   
 }
  

  await product.remove();
  res.status(200).json({
    success:true,
    message :"product deleted successfully"
  })



});

//! Create product review 


exports.createProductReview = catchAsyncError( async (req, res, next )=>{
  // body se ane wala data 
  const {rating ,comment,productId } = req.body;

const review = {
  user:req.user._id,
  name:req.user.name,
  rating:Number(rating), // only Number rating 
  comment,
  

};

// checking the product in database 
const product = await Product.findById(productId); // find product id 

// checking previous review in database 
const isReviewed  =  product.reviews.find(
  (rev) => rev.user.toString() === req.user._id.toString()
  );

if(isReviewed){
 // agar pahle se hi review he to update kar do 
  product.reviews.forEach((rev)=>{

    if(rev.user.toString() === req.user._id.toString())
   ( rev.rating=rating), (rev.comment = comment)

  });


}else{

    // new review he to 
  product.reviews.push(review); // review model me review push kar diya 
  // review ke number me adding kar do 
  product.numOfReviews = product.reviews.length;

}

//  prodcut rating avarage functionality here 
let avg = 0 ; 

 product.reviews.forEach((rev) =>{
   avg = avg + rev.rating;
})

product.ratings = avg / product.reviews.length;

// save the review 
await product.save({validateBeforeSave:false });

res.status(200).json({
  success:true,
  message:"revies successfully added"
})

})


//! GET ALL REVIEWS OF a single PRODUCT


exports.getProductReviews  = catchAsyncError ( async (req , res , next )=>{
  const product = await Product.findById(req.query.id);

  if(!product){
    return next( new Errorhandler("product not found",400))

  }

  res.status(200).json({
    success:true,
    reviews:product.reviews
  })

})

//! Delete review here

exports.deleteReview  = catchAsyncError (async (req , res , next)=>{
  // find the product in database 
  const product = await Product.findById(req.query.productId);

// product is not found 
  if(!product){
    return next (new Errorhandler ("product not found",400))

  }
 // product found 
  const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString()) // review id 
  
let avg=0;
 reviews.forEach((rev)=>{
   avg += rev.rating;
  });

  let ratings = 0;
  if(reviews.length===0){
    ratings = 0;
    
  }else{
    ratings = avg / reviews.length;
  }
  const numOfReviews = reviews.length;

await Product.findByIdAndUpdate(req.query.productId ,
  
  {
  reviews,
  ratings,
  numOfReviews
},

{
  new:true,
  runValidators:true,
  useFindAndModify:false,
 })



  res.status(200).json({
    success:true,
    message:"reviews delete successfully"
  })


})