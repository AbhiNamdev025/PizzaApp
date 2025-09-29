const mongoose = require("mongoose");
const Product = require("../../../Model/ProductModel/productSchema");
const Cart = require("../../../Model/CartModel/cartModel");
const User = require("../../../Model/UserModel/userModel");

const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// const getCartItems = async (req, res) => {
//   const { userId } = req.user.id;

//   try {
//     const cartItems = await Cart.find({ userId: userId });
//     res.status(200).json(cartItems);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
module.exports = getCartItems;
