const express = require("express");
const router = express.Router();
const deleteController = require("../../../Controller/UserControllers/DelController/delContoller");

router.delete("/delete/:id", deleteController.deleteUser);

module.exports = router;
