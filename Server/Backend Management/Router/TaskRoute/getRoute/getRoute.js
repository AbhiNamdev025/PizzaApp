const express = require("express");
const router = express.Router();
const getController = require("../../../Controller/TaskControllers/GetController/getController");

router.get("/find", getController.getTask);

module.exports = router;
