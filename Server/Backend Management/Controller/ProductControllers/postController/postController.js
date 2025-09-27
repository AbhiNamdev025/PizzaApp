const express = require("express");
const productModel = require("../../../Model/ProductModel/productSchema");

exports.postProduct = async (req, res) => {
  try {
    const productData = await productModel.Product.create(req.body);
    console.log(req.body);
    res.json(productData);
  } catch (err) {
    console.error(err);
    res.json("Error in creating product", err);
  }
};
