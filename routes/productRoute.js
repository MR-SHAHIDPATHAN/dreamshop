

const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require("../controller/productController.js");
const { isAuthenticateUser , authorizeRoles } = require("../middleware/Auth.js");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticateUser,authorizeRoles("admin") , createProduct)
router.route("/admin/product/:id").put(isAuthenticateUser,authorizeRoles("admin") , updateProduct)
router.route("/admin/product/:id").delete(isAuthenticateUser,authorizeRoles("admin") , deleteProduct)
router.route("/product/:id").get(getProductDetails); // done 
router.route("/review").put(isAuthenticateUser , createProductReview)
router.route("/reviews").get(getProductReviews);
router.route("/reviews").delete(isAuthenticateUser , deleteReview);
router .route("/admin/products") .get(isAuthenticateUser, authorizeRoles("admin"), getAdminProducts);


module.exports = router;