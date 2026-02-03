const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String },
  size: {
    type: String,
    enum: ["small", "medium", "large", null],
    default: null,
  },
  portion: { type: String, enum: ["half", "full", null], default: null },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  deliveryAddress: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  specialInstructions: { type: String },
  items: [orderItemSchema],
  itemsTotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 40 },
  tax: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  paymentStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Paid"],
  },
  orderStatus: {
    type: String,
    default: "Pending",
    enum: [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

exports.Order = mongoose.model("Order", orderSchema);
