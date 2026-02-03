const express = require("express");
const router = express.Router();
const ratingController = require("../../../Controller/ProductControllers/RatingController/ratingController");
const verifyToken = require("../../../auth/authToken");

router.post("/add/:productId", verifyToken, ratingController.addRating);
router.get("/get/:productId", ratingController.getProductRatings);

module.exports = router;
