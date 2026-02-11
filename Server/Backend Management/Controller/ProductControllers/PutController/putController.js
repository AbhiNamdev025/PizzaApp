const express = require("express");

const productModel = require("../../../Model/ProductModel/productSchema");
const {
  sendPushNotification,
} = require("../../../Utils/pushNotificationHelper");

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    console.log(`Updating product ${id} with data:`, updatedData);
    const updatedProduct = await productModel.Product.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      console.log("Product not found for update");
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product updated successfully:", updatedProduct.name);
    res
      .status(200)
      .json({ message: "Updated Successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error in updating product", error: err });
  }
};

exports.bulkUpdateDiscount = async (req, res) => {
  try {
    const { discount } = req.body;
    console.log("Bulk update discount request received:", discount);
    const result = await productModel.Product.updateMany(
      {},
      { $set: { discount: Number(discount) } },
    );
    console.log("Bulk update result:", result);

    // Notify all users about the new discount
    sendPushNotification(
      null,
      {
        title: "Flash Sale! 🍕",
        body: `We are offering ${discount}% off on all our pizzas! Order now!`,
        icon: "/logo192.png",
        data: { url: "/product" },
      },
      false,
      true,
    ).catch((err) => console.error("Broadcast push failed", err));

    res.status(200).json({ message: "Bulk discount updated successfully" });
  } catch (err) {
    console.error("Bulk update error:", err);
    res
      .status(500)
      .json({ message: "Error in bulk update discount", error: err });
  }
};
