const express = require("express");
const router = express.Router();
const orderController = require("../../Controller/OrderController/orderController");
const verifyToken = require("../../auth/authToken");

// User routes (require authentication)
router.post("/create", verifyToken, orderController.createOrder);
router.get("/my-orders", verifyToken, orderController.getUserOrders);
router.get("/single/:id", verifyToken, orderController.getOrderById);

// Admin routes
router.get("/all", verifyToken, orderController.getAllOrders);
router.put("/update/:id", verifyToken, orderController.updateOrderStatus);
router.delete("/delete/:id", verifyToken, orderController.deleteOrder);
router.get("/stats", verifyToken, orderController.getOrderStats);

module.exports = router;
