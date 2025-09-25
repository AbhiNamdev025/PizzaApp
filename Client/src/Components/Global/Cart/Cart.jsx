import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css";

const CartPage = () => {
  const navigate = useNavigate();

  const cartItems = [];

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <div className={styles.emptyCart}>
          <h2>Your Cart is Empty</h2>
          <p>Add some delicious pizzas to get started!</p>
          <button
            className={styles.continueShopping}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.container}>
        <h1 className={styles.cartTitle}>Your Pizza Cart</h1>
        <p className={styles.cartSubtitle}>
          {cartItems.length} items in your cart
        </p>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.itemImage}
                />

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <span className={styles.itemPrice}>₹{item.price}</span>
                </div>

                <div className={styles.quantityControls}>
                  <span className={styles.quantity}>{item.quantity}</span>
                </div>

                <div className={styles.itemTotal}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Items:</span>
              <span>₹0</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery:</span>
              <span>₹49</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax (5%):</span>
              <span>₹0</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span>₹49</span>
            </div>

            <button className={styles.checkoutBtn}>Proceed to Checkout</button>

            <button
              className={styles.continueShopping}
              onClick={() => navigate("/home")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
