const express = require("express");
const router = express.Router();
const deleteController = require("../../../Controller/TaskControllers/DelController/delContoller");

router.delete("/delete/:id", deleteController.deleteTask);

module.exports = router;
