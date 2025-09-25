const express = require("express");
const userModel = require("../../Model/UserModel/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// exports.loginUser = async (req, res) => {
//   try {
//     console.log("Login request body", req.body);
//     const { email, password } = req.body;

//     const userMatch = await userModel.User.findOne({ email });
//     console.log("User found", userMatch);

//     if (!userMatch) {
//       console.log("User not found");
//       return res.status(404).json({ message: "User not found" });
//     }

//     const passwordMatch = await bcrypt.compare(password, userMatch.password);
//     console.log("Password match", passwordMatch);

//     if (!passwordMatch) {
//       console.log("Invalid credentials");
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: userMatch._id }, process.env.JWT_Secret_Key);

//     console.log("Login successful, token generated", token);

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       user: userMatch,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// };

exports.loginUser = async (req, res) => {
  try {
    console.log("Login request body", req.body);
    const { email, password } = req.body;

    const userMatch = await userModel.User.findOne({ email });
    console.log("User found", userMatch);

    if (!userMatch) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, userMatch.password);
    console.log("Password match", passwordMatch);

    if (!passwordMatch) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: userMatch._id }, process.env.JWT_Secret_Key);

    console.log("Login successful, token generated", token);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userMatch,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
