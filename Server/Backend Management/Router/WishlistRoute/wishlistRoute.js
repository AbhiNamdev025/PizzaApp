const express = require("express");
const router = express.Router();
const wishlistController = require("../../Controller/WishlistController/wishlistController");
const verifyToken = require("../../auth/authToken");

router.post("/toggle", verifyToken, wishlistController.toggleWishlist);
router.get("/all", verifyToken, wishlistController.getWishlist);

module.exports = router;
