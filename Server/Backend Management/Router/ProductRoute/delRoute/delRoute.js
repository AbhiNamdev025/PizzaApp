const express = require("express");
const router = express.Router();
const deleteController = require("../../../Controller/ProductControllers/DelController/delContoller");

router.delete("/delete/:id", deleteController.deleteProduct);

module.exports = router;
