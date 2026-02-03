const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    sizes: {
      small: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      large: { type: Number, default: 0 },
    },
    portions: {
      half: { type: Number, default: 0 },
      full: { type: Number, default: 0 },
    },
    hasSizes: { type: Boolean, default: false },
    hasPortions: { type: Boolean, default: false },
    image: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    isVeg: { type: Boolean, default: true },
    category: {
      type: String,
      enum: [
        "Fast Food",
        "Junk Food",
        "Drinks",
        "Desserts",
        "Snacks",
        "Combos",
        "Main Course",
      ],
      default: "Fast Food",
    },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true },
);

exports.Product = mongoose.model("Product", productSchema);
