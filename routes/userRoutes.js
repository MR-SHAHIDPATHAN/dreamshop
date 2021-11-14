

const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, deleteUser, updateUserRole } = require('../controller/userController');
const { isAuthenticateUser , authorizeRoles } = require("../middleware/Auth.js");






const router = express.Router();




router.route('/register').post(registerUser) 
router.route('/login').post(loginUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logout)
router.route('/me').get( isAuthenticateUser, getUserDetails)
router.route("/password/update").put(isAuthenticateUser, updatePassword)
router.route("/me/update").put(isAuthenticateUser, updateProfile)

router.route("/admin/users").get(isAuthenticateUser,authorizeRoles('admin'), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticateUser,authorizeRoles('admin'), getSingleUser);

router.route("/admin/user/:id").put(isAuthenticateUser,authorizeRoles('admin'), updateUserRole);
router.route("/admin/user/:id").delete(isAuthenticateUser,authorizeRoles('admin'), deleteUser);


module.exports = router;
