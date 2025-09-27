const express = require("express");
const router = express.Router();
const {
  addToCart,
} = require("../../../Controller/CartController/postController/addController");

router.post("/add", addToCart);

module.exports = router;
