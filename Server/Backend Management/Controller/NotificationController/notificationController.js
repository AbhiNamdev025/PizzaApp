const {
  PushSubscription,
} = require("../../Model/PushSubscriptionModel/pushSubscriptionModel");

exports.subscribe = async (req, res) => {
  try {
    const { subscription, userId } = req.body;

    // We update if the subscription for this user already exists or create a new one
    // Note: One user might have multiple devices/subscriptions, so we usually
    // want to store all of them or identify by endpoint.

    await PushSubscription.findOneAndUpdate(
      { "subscription.endpoint": subscription.endpoint },
      { user: userId, subscription },
      { upsert: true, new: true },
    );

    res.status(201).json({ message: "Subscription saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save subscription", error: error.message });
  }
};
