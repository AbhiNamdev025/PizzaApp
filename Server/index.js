const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const mongourl = process.env.MongoURL;

//product
const postProductData = require("./Backend Management/Router/ProductRoute/postRoute/postRoute");
const getProductData = require("./Backend Management/Router/ProductRoute/getRoute/getRoute");
const deleteProductData = require("./Backend Management/Router/ProductRoute/delRoute/delRoute");
const updateProductData = require("./Backend Management/Router/ProductRoute/updateRoute/putRoute");
//User
const getUserData = require("./Backend Management/Router/UserRoute/getRoute/getRoute");
const postUserData = require("./Backend Management/Router/UserRoute/postRoute/postRoute");
const putUserData = require("./Backend Management/Router/UserRoute/updateRoute/putRoute");
const deleteUserData = require("./Backend Management/Router/UserRoute/delRoute/delRoute");

const loginUser = require("./Backend Management/Router/LoginRoute/loginRoute");

//cart
const addCart = require("./Backend Management/Router/CartRoute/addroute/addRoute");
const getCart = require("./Backend Management/Router/CartRoute/getRoute/getcart");
const delCart = require("./Backend Management/Router/CartRoute/delRoute/delRoute")

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(mongourl)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection failed:", err));

//For Produts
app.use("/product", postProductData);
app.use("/product", getProductData);
app.use("/product", deleteProductData);
app.use("/product", updateProductData);
//For User
app.use("/user", getUserData);
app.use("/user", postUserData);
app.use("/user", putUserData);
app.use("/user", deleteUserData);
app.use("/user", loginUser);

//cart
app.use("/cart", addCart);
app.use("/cart", getCart);
app.use("/cart", delCart)

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});
app.listen(port, () => {
  console.log(`Running at port ${port}`);
});
