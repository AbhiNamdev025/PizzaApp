const express = require("express");
const router = express.Router();
const updateController = require("../../../Controller/UserControllers/PutController/putController");

router.put("/update/:id", updateController.updateUser);

module.exports = router;
