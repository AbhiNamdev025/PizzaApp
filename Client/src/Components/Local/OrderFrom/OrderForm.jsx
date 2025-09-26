import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./orderform.module.css";

function OrderForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    city: "",
    pincode: "",
    paymentMethod: "UPI",
    specialInstructions: "",
  });

  const orderItems = [
    {
      id: 1,
      name: "Margherita",
      price: 399,
      quantity: 2,
      image:
        "https://safrescobaldistatic.blob.core.windows.net/media/2022/11/PIZZA-MARGHERITA.jpg",
    },
    {
      id: 2,
      name: "Pepperoni",
      price: 499,
      quantity: 1,
      image:
        "https://media.istockphoto.com/id/521403691/photo/hot-homemade-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=PaISuuHcJWTEVoDKNnxaHy7L2BTUkyYZ06hYgzXmTbo=",
    },
  ];

  const handleInputChange = (e) => {};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
    alert("Order placed successfully!");
    navigate("/confirmation");
  };

  // const itemsTotal
  //   orderItems();
  //   // (total, item) => total + item.price * item.quantity
  const deliveryFee = 49;
  const tax = 0.05;
  // const grandTotal = itemsTotal + deliveryFee + tax;

  return (
    <div className={styles.orderContainer}>
      <div className={styles.container}>
        <h1 className={styles.orderTitle}>Checkout</h1>
        <p className={styles.orderSubtitle}>Complete your order details</p>

        <div className={styles.orderContent}>
          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            {orderItems.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h4 className={styles.itemName}>{item.name}</h4>
                  <span className={styles.itemPrice}>
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>
                <div className={styles.itemTotal}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.checkoutForm}>
            <form onSubmit={handleSubmit}>
              <h3>Delivery Information</h3>

              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Delivery Address *</label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter complete delivery address"
                  rows="3"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash on Delivery</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for delivery..."
                  rows="2"
                />
              </div>

              <div className={styles.orderTotal}>
                <h4>Order Total</h4>
                <div className={styles.totalRow}>
                  <span>Items</span>
                  <span>₹</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Delivery:</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Tax (5%):</span>
                  <span>₹{tax}</span>
                </div>
                <div className={styles.grandTotal}>
                  <span>Total:</span>
                  <span>₹</span>
                </div>
              </div>

              <button type="submit" className={styles.placeOrderBtn}>
                Place Order - ₹
              </button>

              <button
                type="button"
                className={styles.backButton}
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
