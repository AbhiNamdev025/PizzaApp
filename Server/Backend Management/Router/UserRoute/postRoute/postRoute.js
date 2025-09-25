const express = require("express");
const router = express.Router();
const postController = require("../../../Controller/UserControllers/postController/postController");

router.post("/add", postController.postUser);

module.exports = router;
