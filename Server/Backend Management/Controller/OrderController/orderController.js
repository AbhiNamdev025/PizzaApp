const { Order } = require("../../Model/OrderModel/orderSchema");
const Cart = require("../../Model/CartModel/cartModel");
const { sendOrderNotificationToAdmin } = require("../../Utils/emailService");
const { sendPushNotification } = require("../../Utils/pushNotificationHelper");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      customerName,
      phone,
      email,
      deliveryAddress,
      city,
      pincode,
      specialInstructions,
      items,
      itemsTotal,
      deliveryCharge,
      tax,
      grandTotal,
    } = req.body;

    if (!customerName || !phone || !deliveryAddress || !city || !pincode) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = new Order({
      orderId,
      userId,
      customerName,
      phone,
      email,
      deliveryAddress,
      city,
      pincode,
      specialInstructions,
      items,
      itemsTotal: parseFloat(itemsTotal),
      deliveryCharge: parseFloat(deliveryCharge),
      tax: parseFloat(tax),
      grandTotal: parseFloat(grandTotal),
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    await newOrder.save();

    await Cart.deleteMany({ userId });

    sendOrderNotificationToAdmin(newOrder).catch(() => {});

    // Web Push Notification to Admin
    sendPushNotification(
      null,
      {
        title: "New Order! 🍕",
        body: `New order ${orderId} placed by ${customerName}.`,
        icon: "/logo192.png",
        data: { url: "/admin/orders" },
      },
      true,
    ).catch((err) => console.error("Admin push failed", err));

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    updateData.updatedAt = Date.now();

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Web Push Notification to User
    if (orderStatus) {
      sendPushNotification(order.userId, {
        title: "Order Status Update! 🍕",
        body: `Your order ${order.orderId} is now ${orderStatus}.`,
        icon: "/logo192.png",
        data: { url: "/my-orders" },
      }).catch((err) => console.error("User push failed", err));
    }

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });
    const confirmedOrders = await Order.countDocuments({
      orderStatus: "Confirmed",
    });
    const preparingOrders = await Order.countDocuments({
      orderStatus: "Preparing",
    });
    const outForDeliveryOrders = await Order.countDocuments({
      orderStatus: "Out for Delivery",
    });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);

    res.status(200).json({
      totalOrders,
      pendingOrders,
      confirmedOrders,
      preparingOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: error.message });
  }
};
