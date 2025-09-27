const cartModel = require("../../../Model/CartModel/cartModel");

const removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await cartModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart", result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in deleting item", error: err.message });
  }
};

module.exports = { removeFromCart };
