const express = require("express");
const productModel = require("../../../Model/ProductModel/productSchema")
exports.getProduct = async (req, res) => {
  try {
    const products = await productModel.Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.json("Error in getting product", err);
  }
};
