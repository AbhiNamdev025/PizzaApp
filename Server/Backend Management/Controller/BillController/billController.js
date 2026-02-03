const { Bill } = require("../../Model/BillModel/billSchema");
const { Order } = require("../../Model/OrderModel/orderSchema");

exports.generateBill = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let bill = await Bill.findOne({ orderId });

    if (bill) {
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findOne({ $or: [{ billId: id }, { orderId: id }] });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
