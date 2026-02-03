const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  billId: { type: String, required: true, unique: true }, // Format: BIL-Timestamp-Random
  orderId: { type: String, required: true, ref: "Order" }, // Linking to Order via orderId (string) or ObjectId if changed. OrderSchema uses String orderId.
  customerName: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true },
      size: { type: String },
      portion: { type: String },
    },
  ],
  subTotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
  billStatus: { type: String, default: "Issued" }, // Issued, Cancelled
});

exports.Bill = mongoose.model("Bill", billSchema);
