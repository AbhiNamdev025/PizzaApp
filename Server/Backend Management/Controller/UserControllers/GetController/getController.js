const express = require("express");
const userModel = require("../../../Model/UserModel/userModel");

exports.getUser = async (req, res) => {
  try {
    const users = await userModel.User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error in getting user", err);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
