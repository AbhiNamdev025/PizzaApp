const { Bill } = require("../../Model/BillModel/billSchema");
const { Order } = require("../../Model/OrderModel/orderSchema");

// Generate a Bill for an Order
exports.generateBill = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Fetch order details
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if bill already exists
    let bill = await Bill.findOne({ orderId });

    if (bill) {
      // Update items in case schema/logic changed (Development fix)
      bill.items = order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        size: item.size,
        portion: item.portion,
      }));
      bill.subTotal = order.itemsTotal;
      bill.grandTotal = order.grandTotal;
      await bill.save();

      return res.status(200).json({ message: "Bill fetched/updated", bill });
    }

    // Create new bill
    const newBill = new Bill({
      billId: `BIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: order.orderId,
      customerName: order.customerName,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        size: item.size,
        portion: item.portion,
      })),
      subTotal: order.itemsTotal,
      tax: order.tax,
      deliveryCharge: order.deliveryCharge,
      grandTotal: order.grandTotal,
      paymentMethod: order.paymentMethod,
    });

    await newBill.save();
    res
      .status(201)
      .json({ message: "Bill generated successfully", bill: newBill });
  } catch (error) {
    console.error("Error generating bill:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Bill by Order ID or Bill ID
exports.getBill = async (req, res) => {
  try {
    const { id } = req.params;
    // Try finding by billId first, then orderId
    const bill = await Bill.findOne({ $or: [{ billId: id }, { orderId: id }] });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
