const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../../../Model/UserModel/userModel");

exports.postUser = async (req, res) => {
  try {
    console.log("Before Hashing request body", req.body.password);

    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    req.body.password = hashedPassword;
    console.log("After Updating request body", req.body);

    const userData = await userModel.User.create({
      ...req.body,
      email: req.body.email.toLowerCase(),
    });

    res.status(201).json(userData);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};
