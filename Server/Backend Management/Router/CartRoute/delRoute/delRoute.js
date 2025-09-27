const express = require("express");
const router = express.Router();
const delCart = require("../../../Controller/CartController/deleteController/delcontroller");

router.delete("/del/:id", delCart.removeFromCart);

module.exports = router;
