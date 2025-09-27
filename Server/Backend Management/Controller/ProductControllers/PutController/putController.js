const express = require("express");

const productModel = require("../../../Model/ProductModel/productSchema");

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedproduct = await productModel.Product.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );
    console.log(updatedproduct);
    res.status(200).json("Updated Successfully", updatedproduct);
  } catch (err) {
    res.status(500).json("Error in updating product", err);
  }
};
