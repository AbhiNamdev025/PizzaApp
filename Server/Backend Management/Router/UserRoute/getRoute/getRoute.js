const express = require("express");
const router = express.Router();
const getController = require("../../../Controller/UserControllers/GetController/getController");

const verifyToken = require("../../../auth/authToken");

router.get("/find", getController.getUser);
router.get("/profile", verifyToken, getController.getProfile);

module.exports = router;
