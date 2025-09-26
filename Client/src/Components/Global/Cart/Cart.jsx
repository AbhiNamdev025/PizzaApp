import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css";

const CartPage = () => {
  const navigate = useNavigate();

  const cartItems = [
    {
      id: 1,
      name: "Margherita",
      price: 399,
      image:
        "https://safrescobaldistatic.blob.core.windows.net/media/2022/11/PIZZA-MARGHERITA.jpg",
      description: "Classic tomato sauce and mozzarella",
      quantity: 2,
    },
    {
      id: 2,
      name: "Pepperoni",
      price: 499,
      image:
        "https://media.istockphoto.com/id/521403691/photo/hot-homemade-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=PaISuuHcJWTEVoDKNnxaHy7L2BTUkyYZ06hYgzXmTbo=",
      description: "Pepperoni with extra cheese",
      quantity: 1,
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <div className={styles.emptyCart}>
          <h2>Your Cart is Empty</h2>
          <p>Add some delicious pizzas to get started!</p>
          <button
            className={styles.continueShopping}
            onClick={() => navigate("/home")}
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
            {cartItems.map((cartItem) => (
              <div key={cartItem.id} className={styles.cartItem}>
                <div>
                  <img
                    src={cartItem.image}
                    alt={cartItem.name}
                    className={styles.itemImage}
                  />
                </div>
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{cartItem.name}</h3>
                  <p className={styles.itemDescription}>
                    {cartItem.description}
                  </p>
                  <span className={styles.itemPrice}>₹{cartItem.price}</span>
                </div>

                <div>
                  <div className={styles.itemTotal}>
                    ₹{cartItem.price * cartItem.quantity}
                  </div>
                  <div className={styles.quantityControls}>
                    <span className={styles.quantity}>Quantity : {cartItem.quantity}</span>
                  </div>

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

            <button
              className={styles.checkoutBtn}
              onClick={() => navigate("/order")}
            >
              Proceed to Checkout
            </button>

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
