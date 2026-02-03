const { Order } = require("../../Model/OrderModel/orderSchema");
const Cart = require("../../Model/CartModel/cartModel");
const { sendOrderNotificationToAdmin } = require("../../Utils/emailService");

// Create new order
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

    // Clear user's cart after order
    await Cart.deleteMany({ userId });

    // Send email notification to admin (async, don't block response)
    sendOrderNotificationToAdmin(newOrder).catch(() => {});

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

// Get all orders (Admin)
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

// Get user's orders
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

// Get single order
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

// Update order status (Admin)
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

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
};

// Delete order (Admin)
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

// Get order stats (Admin)
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
