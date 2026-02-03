const Cart = require("../../Model/CartModel/cartModel");

const updateQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const userId = req.user.id;

  if (!cartItemId || quantity === undefined) {
    return res
      .status(400)
      .json({ message: "Cart item ID and quantity are required" });
  }

  try {
    const qty = parseInt(quantity);
    if (qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await Cart.findOne({ _id: cartItemId, userId: userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = qty;
    await cartItem.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cartItem: cartItem,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  updateQuantity,
};
