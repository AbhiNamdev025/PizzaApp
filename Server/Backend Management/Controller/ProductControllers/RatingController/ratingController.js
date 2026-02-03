const productModel = require("../../../Model/ProductModel/productSchema");

// Add rating to product
exports.addRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const product = await productModel.Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add new rating (Allowing multiple ratings per user as requested)
    product.ratings.push({
      userId,
      userName,
      rating,
      review,
    });

    // Calculate average rating
    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = (sumRatings / totalRatings).toFixed(1);
    product.totalRatings = totalRatings;

    await product.save();

    res.status(200).json({
      message: "Rating added successfully",
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ message: "Error adding rating", error });
  }
};

// Get product ratings
exports.getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.Product.findById(productId).select(
      "ratings averageRating totalRatings",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      ratings: product.ratings,
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting ratings", error });
  }
};
