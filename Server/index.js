const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT;
const mongourl = process.env.MongoURL;

const postProductData = require("./Backend Management/Router/ProductRoute/postRoute/postRoute");
const getProductData = require("./Backend Management/Router/ProductRoute/getRoute/getRoute");
const deleteProductData = require("./Backend Management/Router/ProductRoute/delRoute/delRoute");
const updateProductData = require("./Backend Management/Router/ProductRoute/updateRoute/putRoute");
const ratingRoutes = require("./Backend Management/Router/ProductRoute/ratingRoute/ratingRoute");

const getUserData = require("./Backend Management/Router/UserRoute/getRoute/getRoute");
const postUserData = require("./Backend Management/Router/UserRoute/postRoute/postRoute");
const putUserData = require("./Backend Management/Router/UserRoute/updateRoute/putRoute");
const deleteUserData = require("./Backend Management/Router/UserRoute/delRoute/delRoute");
const forgotPasswordData = require("./Backend Management/Router/UserRoute/forgotPasswordRoute");

const loginUser = require("./Backend Management/Router/LoginRoute/loginRoute");

const addCart = require("./Backend Management/Router/CartRoute/addroute/addRoute");
const getCart = require("./Backend Management/Router/CartRoute/getRoute/getcart");
const delCart = require("./Backend Management/Router/CartRoute/delRoute/delRoute");
const updateCart = require("./Backend Management/Router/CartRoute/updateRoute/updateRoute");

const orderRoutes = require("./Backend Management/Router/OrderRoute/orderRoute");

const uploadRoutes = require("./Backend Management/Router/UploadRoute/uploadRoute");
const wishlistRoutes = require("./Backend Management/Router/WishlistRoute/wishlistRoute");
const billRoutes = require("./Backend Management/Router/BillRoute/billRoute");
const notificationRoutes = require("./Backend Management/Router/NotificationRoute/notificationRoute");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(mongourl)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

app.use("/product", postProductData);
app.use("/product", getProductData);
app.use("/product", deleteProductData);
app.use("/product", updateProductData);
app.use("/rating", ratingRoutes);

app.use("/user", getUserData);
app.use("/user", postUserData);
app.use("/user", putUserData);
app.use("/user", deleteUserData);
app.use("/user", forgotPasswordData);
app.use("/user", loginUser);

app.use("/cart", addCart);
app.use("/cart", getCart);
app.use("/cart", delCart);
app.use("/cart", updateCart);

app.use("/order", orderRoutes);

app.use("/upload", uploadRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/bill", billRoutes);
app.use("/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});
