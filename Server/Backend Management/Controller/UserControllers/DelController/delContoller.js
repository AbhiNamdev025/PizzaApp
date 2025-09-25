const express = require("express");
const userModel = require("../../../Model/UserModel/userModel");

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userModel.User.findByIdAndDelete(id);

    res.status(200).json("User deleted successfully", result);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error in deleting User", err);
  }
};
