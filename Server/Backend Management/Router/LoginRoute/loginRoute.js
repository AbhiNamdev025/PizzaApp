const express = require("express");
const loginData = require("../../Controller/LoginController/loginController");
const router = express.Router();

router.post("/login", loginData.loginUser);

module.exports = router;
