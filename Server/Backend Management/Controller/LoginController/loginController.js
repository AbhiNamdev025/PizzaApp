const express = require("express");
const userModel = require("../../Model/UserModel/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userMatch = await userModel.User.findOne({ email });

    if (!userMatch) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, userMatch.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: userMatch._id, name: userMatch.name, role: userMatch.role },
      process.env.JWT_Secret_Key,
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userMatch,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
