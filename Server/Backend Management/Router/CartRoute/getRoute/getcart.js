// const express = require("express");
// const router = express.Router();
// const getCart = require("../../../Controller/CartController/getController/getController");

// router.get("/find", getCart);

// module.exports = router;

const express = require("express");
const router = express.Router();
const getCart = require("../../../Controller/CartController/getController/getController");

router.get("/find/:token", getCart);

module.exports = router;
