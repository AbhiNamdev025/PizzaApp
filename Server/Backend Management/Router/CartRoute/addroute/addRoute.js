const express = require("express");
const router = express.Router();
const {
  addToCart,
} = require("../../../Controller/CartController/postController/addController");

const authenticateToken = require("../../../auth/authToken");

router.post("/add", authenticateToken, addToCart);

module.exports = router;
