const express = require("express");
const router = express.Router();
const updateController = require("../../../Controller/ProductControllers/PutController/putController");

router.put("/update/:id", updateController.updateProduct);

module.exports = router;
