// const cartModel = require("../../../Model/CartModel/cartModel");

// const removeFromCart = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await cartModel.findByIdAndDelete(id);

//     if (!result) {
//       return res.status(404).json({ message: "Cart item not found" });
//     }

//     res.status(200).json({ message: "Item removed from cart", result });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error in deleting item", error: err.message });
//   }
// };

// module.exports = { removeFromCart };

const Cart = require("../../../Model/CartModel/cartModel");

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await Cart.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!result) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = removeFromCart;
