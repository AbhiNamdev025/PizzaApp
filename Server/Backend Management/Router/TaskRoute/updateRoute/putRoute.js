const express = require("express");
const router = express.Router();
const updateController = require("../../../Controller/TaskControllers/PutController/putController");

router.put("/update/:id", updateController.updateTask);

module.exports = router;
