const express = require("express");

const productModel = require("../../../Model/ProductModel/productSchema");

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productModel.Product.findByIdAndDelete(id);

    res.status(500).json("product deleted successfully", result);
  } catch (err) {
    res.status(500).json("Error in deleting product", err);
  }
};
