// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema({
//   token: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   productId: mongoose.Schema.Types.ObjectId,
//   name: { type: String },
//   price: { type: String },
//   image: { type: String },
//   quantity: { type: Number, default: 1 },
// });

// module.exports = mongoose.model("Cart", cartSchema);

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  price: { type: String },
  image: { type: String },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Cart", cartSchema);
