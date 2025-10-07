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
//     console.log(token)

//     const cartItems = await Cart.find( );
//     console.log(cartItems);
    
//     // Return the array directly instead of wrapping in an object
//     res.status(200).json(cartItems);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };




const getCartItems = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Token received:", token);

    // Check if token is provided and not empty
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      return res.status(400).json({ 
        message: "Token is required",
        cartItems: [] 
      });
    }

    // Only find cart items that match the token
    const cartItems = await Cart.find();
    console.log("Cart items found:", cartItems);
    
    // Return the array directly
    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = getCartItems;
