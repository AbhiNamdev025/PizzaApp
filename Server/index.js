const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT;
const mongourl = process.env.MongoURL;

//product
const postProductData = require("./Backend Management/Router/ProductRoute/postRoute/postRoute");
const getProductData = require("./Backend Management/Router/ProductRoute/getRoute/getRoute");
const deleteProductData = require("./Backend Management/Router/ProductRoute/delRoute/delRoute");
const updateProductData = require("./Backend Management/Router/ProductRoute/updateRoute/putRoute");
const ratingRoutes = require("./Backend Management/Router/ProductRoute/ratingRoute/ratingRoute");

//User
const getUserData = require("./Backend Management/Router/UserRoute/getRoute/getRoute");
const postUserData = require("./Backend Management/Router/UserRoute/postRoute/postRoute");
const putUserData = require("./Backend Management/Router/UserRoute/updateRoute/putRoute");
const deleteUserData = require("./Backend Management/Router/UserRoute/delRoute/delRoute");

const loginUser = require("./Backend Management/Router/LoginRoute/loginRoute");

//cart
const addCart = require("./Backend Management/Router/CartRoute/addroute/addRoute");
const getCart = require("./Backend Management/Router/CartRoute/getRoute/getcart");
const delCart = require("./Backend Management/Router/CartRoute/delRoute/delRoute");
const updateCart = require("./Backend Management/Router/CartRoute/updateRoute/updateRoute");

//orders
const orderRoutes = require("./Backend Management/Router/OrderRoute/orderRoute");

//upload
const uploadRoutes = require("./Backend Management/Router/UploadRoute/uploadRoute");
const wishlistRoutes = require("./Backend Management/Router/WishlistRoute/wishlistRoute");
const billRoutes = require("./Backend Management/Router/BillRoute/billRoute");

const app = express();

app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(mongourl)
  .then(() => {
    console.log("DB connected");
    app.listen(port, () => {
      console.log(`Running at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });

//For Produts
app.use("/product", postProductData);
app.use("/product", getProductData);
app.use("/product", deleteProductData);
app.use("/product", updateProductData);
app.use("/rating", ratingRoutes);

//For User
app.use("/user", getUserData);
app.use("/user", postUserData);
app.use("/user", putUserData);
app.use("/user", deleteUserData);
app.use("/user", loginUser);

//cart
app.use("/cart", addCart);
app.use("/cart", getCart);
app.use("/cart", delCart);
app.use("/cart", updateCart);

//orders
app.use("/order", orderRoutes);

//upload
app.use("/upload", uploadRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/bill", billRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.listen(port, () => {
  console.log(`Running at port ${port}`);
});
