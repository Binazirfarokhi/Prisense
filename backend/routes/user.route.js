const express = require("express");
const {UsersController} = require("../controller/user.controller");
const {verifyUser} = require("../middlewares/verifyAuth");

const router = express.Router();

router.post("/register", UsersController.signUp);
router.post("/login", UsersController.signIn);
router.get('/confirm-email', UsersController.confirmEmail);
router.post('/request-reset-password', UsersController.generateResetPasswordLink);
router.put("/reset-password", UsersController.resetPassword);
router.get("/profile", verifyUser, UsersController.getProfile);
router.put("/profile", verifyUser, UsersController.updateProfile);
router.put('/settings', verifyUser, UsersController.updateSetting);
router.get('/notifications', verifyUser, UsersController.getNotification);
module.exports = router;