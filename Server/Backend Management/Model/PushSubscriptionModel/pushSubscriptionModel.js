const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription: {
      endpoint: String,
      expirationTime: Number,
      keys: {
        p256dh: String,
        auth: String,
      },
    },
  },
  { timestamps: true },
);

exports.PushSubscription = mongoose.model(
  "PushSubscription",
  pushSubscriptionSchema,
);
