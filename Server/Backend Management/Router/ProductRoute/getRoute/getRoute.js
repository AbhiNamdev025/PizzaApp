const express = require("express");
const router = express.Router();
const getController = require("../../../Controller/ProductControllers/GetController/getController");

router.get("/find", getController.getProduct);
router.get("/get/:id", getController.getProductById);

module.exports = router;
