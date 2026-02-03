const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../../../Model/UserModel/userModel");

exports.postUser = async (req, res) => {
  try {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    req.body.password = hashedPassword;

    const userData = await userModel.User.create({
      ...req.body,
      email: req.body.email.toLowerCase(),
    });

    res.status(201).json(userData);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};
