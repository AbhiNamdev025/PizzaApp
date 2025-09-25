const express = require("express");
const router = express.Router();
const getController = require("../../../Controller/UserControllers/GetController/getController");

router.get("/find", getController.getUser);

module.exports = router;
