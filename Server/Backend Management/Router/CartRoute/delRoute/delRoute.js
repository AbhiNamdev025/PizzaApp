const express = require("express");
const router = express.Router();
const removeFromCart = require("../../../Controller/CartController/deleteController/delcontroller");
const authenticateToken = require("../../../auth/authToken");

router.delete("/del/:id", authenticateToken, removeFromCart);
module.exports = router;
