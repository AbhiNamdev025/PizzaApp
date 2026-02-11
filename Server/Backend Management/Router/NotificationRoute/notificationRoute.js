const express = require("express");
const router = express.Router();
const notificationController = require("../../Controller/NotificationController/notificationController");

router.post("/subscribe", notificationController.subscribe);

module.exports = router;
