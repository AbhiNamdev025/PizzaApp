const mongoose = require("mongoose");
const Product = require("../../../Model/ProductModel/productSchema");
const Cart = require("../../../Model/CartModel/cartModel");
const User = require("../../../Model/UserModel/userModel");

// const addToCart = async (req, res) => {
//   const { productId } = req.body;
//   const { token } = req.body;

//   try {
//     const product = await mongoose.model("Product").findById(productId);

//     if (!product) {
//       return res.status(404).json("Product not found");
//     }

//     const cartItem = await Cart.findOne({ productId: product._id });

//     if (cartItem) {
//       cartItem.quantity += 1;
//       await cartItem.save();
//       res.status(200).json({
//         message: "Item quantity updated in cart",
//         cartItem: cartItem,
//       });
//     } else {
//       const cartItem = new Cart({
//         token: token,
//         productId: product._id,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         description: product.description,
//         quantity: 1,
//       });

//       await cartItem.save();
//       res.status(200).json({
//         message: "Product added to cart",
//         cartItem: cartItem,
//       });

//     }
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const addToCart = async (req, res) => {
  const { productId, quantity, size, portion, customPrice } = req.body;
  const userId = req.user.id;

  const qty = parseInt(quantity) || 1;

  try {
    const product = await mongoose.model("Product").findById(productId);

    if (!product) {
      return res.status(404).json("Product not found");
    }

    // Determine the final price
    let finalPrice = customPrice || product.price;

    // Build unique cart key with size/portion
    const cartQuery = {
      productId: product._id,
      userId: userId,
    };
    if (size) cartQuery.size = size;
    if (portion) cartQuery.portion = portion;

    const cartItem = await Cart.findOne(cartQuery);

    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
      res.status(200).json({
        message: "Item quantity updated in cart",
        cartItem: cartItem,
      });
    } else {
      const newCartItem = new Cart({
        userId: userId,
        productId: product._id,
        name: product.name,
        price: finalPrice,
        image: product.image,
        description: product.description,
        quantity: qty,
        size: size || null,
        portion: portion || null,
      });

      await newCartItem.save();
      res.status(200).json({
        message: "Product added to cart",
        cartItem: newCartItem,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addToCart,
};
