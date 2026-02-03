const express = require("express");
const productModel = require("../../../Model/ProductModel/productSchema");

exports.getProduct = async (req, res) => {
  try {
    const products = await productModel.Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.json("Error in getting product", err);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productModel.Product.findById(req.params.id).populate(
      "ratings.userId",
      "name",
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting product", error: err });
  }
};
