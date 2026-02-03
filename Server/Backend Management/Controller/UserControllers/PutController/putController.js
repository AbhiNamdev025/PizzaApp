const express = require("express");
const userModel = require("../../../Model/UserModel/userModel");

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await userModel.User.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true },
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json("Error in updating User", err);
  }
};
