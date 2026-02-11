const express = require("express");
const router = express.Router();
const forgotPasswordController = require("../../Controller/UserControllers/ForgotPasswordController");

router.post("/forgot-password", forgotPasswordController.requestOTP);
router.post("/verify-otp", forgotPasswordController.verifyOTP);
router.post("/reset-password", forgotPasswordController.resetPassword);

module.exports = router;
