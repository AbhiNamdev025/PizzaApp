const express = require("express");

const productModel = require("../../../Model/ProductModel/productSchema");

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await productModel.Product.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Updated Successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error in updating product", error: err });
  }
};
