
const express = require("express");
const { newOrder, getSingleOrder, myOrder, getAllOrders, updateOrder, deleteOrder } = require("../controller/orderController.js");
const { isAuthenticateUser , authorizeRoles } = require("../middleware/Auth.js");


const router = express.Router();


 router.route("/order/new").post(isAuthenticateUser, newOrder)
 router.route("/order/:id").get(isAuthenticateUser, getSingleOrder)
 router.route("/orders/me").get(isAuthenticateUser, myOrder)

 router.route("/admin/orders").get(isAuthenticateUser,authorizeRoles("admin"), getAllOrders)
 router.route("/admin/order/:id").put(isAuthenticateUser,authorizeRoles("admin"), updateOrder)
 router.route("/admin/order/:id").delete(isAuthenticateUser,authorizeRoles("admin"), deleteOrder)


module.exports = router;