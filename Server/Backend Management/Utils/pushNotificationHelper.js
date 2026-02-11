const webpush = require("web-push");
const {
  PushSubscription,
} = require("../Model/PushSubscriptionModel/pushSubscriptionModel");
const { User } = require("../Model/UserModel/userModel");

webpush.setVapidDetails(
  "mailto:nmdvabhi786@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

exports.sendPushNotification = async (
  userId,
  payload,
  forceAdmin = false,
  broadcastToAll = false,
) => {
  try {
    let query = {};

    if (broadcastToAll) {
      // Send to everyone
      query = {};
    } else if (forceAdmin) {
      // Send to admin specifically
      const admin = await User.findOne({ role: "admin" });
      if (admin) query = { user: admin._id };
      else return;
    } else {
      // Send to specific user
      query = { user: userId };
    }

    const subscriptions = await PushSubscription.find(query);

    const notifications = subscriptions.map((sub) => {
      return webpush
        .sendNotification(sub.subscription, JSON.stringify(payload))
        .catch(async (err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Subscription has expired or is no longer valid
            await PushSubscription.deleteOne({ _id: sub._id });
          }
          console.error("Error sending push notification:", err);
        });
    });

    await Promise.all(notifications);
  } catch (error) {
    console.error("Failed to send push notification:", error);
  }
};
