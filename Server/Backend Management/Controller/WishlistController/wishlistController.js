const userModel = require("../../Model/UserModel/userModel");
const productModel = require("../../Model/ProductModel/productSchema");

// Toggles item in wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const user = await userModel.User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(productId);
      await user.save();
      return res
        .status(200)
        .json({ message: "Added to wishlist", isWishlisted: true });
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
      await user.save();
      return res
        .status(200)
        .json({ message: "Removed from wishlist", isWishlisted: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Gets user wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.User.findById(userId).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
