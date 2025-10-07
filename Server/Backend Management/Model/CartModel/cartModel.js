const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId },
  token: { type: String },
  name: { type: String },
  price: { type: String },
  image: { type: String },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Cart", cartSchema);

// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   name: { type: String, required: true },
//   price: { type: String, required: true },
//   image: { type: String, required: true },
//   description: { type: String },
//   quantity: { type: Number, default: 1 },
// });

// module.exports = mongoose.model("Cart", cartSchema);
