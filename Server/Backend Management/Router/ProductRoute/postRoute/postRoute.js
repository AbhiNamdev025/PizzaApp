const express = require("express");
const router = express.Router();
const postController = require("../../../Controller/ProductControllers/postController/postController");

router.post("/add", postController.postProduct);

module.exports = router;
