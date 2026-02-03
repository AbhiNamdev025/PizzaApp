const mongoose = require("mongoose");
const Product = require("../../../Model/ProductModel/productSchema");
const Cart = require("../../../Model/CartModel/cartModel");
const User = require("../../../Model/UserModel/userModel");

// const getCartItems = async (req, res) => {
//   try {
//     const cartItems = await Cart.find();
//     res.status(200).json(cartItems);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// module.exports = getCartItems;

// const getCartItems = async (req, res) => {
//   try {
//     const { token } = req.params;

//     const cartItems = await Cart.find( );

//     // Return the array directly instead of wrapping in an object
//     res.status(200).json(cartItems);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        cartItems: [],
      });
    }

    const cartItems = await Cart.find({ userId: userId });

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = getCartItems;
