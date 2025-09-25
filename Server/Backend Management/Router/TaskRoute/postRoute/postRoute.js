const express = require("express");
const router = express.Router();
const postController = require("../../../Controller/TaskControllers/postController/postController");

router.post("/add", postController.postTask);

module.exports = router;
