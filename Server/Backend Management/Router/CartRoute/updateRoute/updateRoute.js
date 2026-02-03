const express = require("express");
const router = express.Router();
const {
  updateQuantity,
} = require("../../../Controller/CartController/updateController");
const authenticateToken = require("../../../auth/authToken");

router.put("/update", authenticateToken, updateQuantity);

module.exports = router;
