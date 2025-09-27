const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  name: String,
  price: String,
  image: String,
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Cart", cartSchema);
