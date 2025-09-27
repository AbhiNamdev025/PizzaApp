import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css";
import { toast } from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await fetch("http://localhost:2525/cart/find");
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const res = await fetch(`http://localhost:2525/cart/del/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCartItems();
        toast.warn("Item Removed From Cart");
      } else {
        console.log("Failed to remove item from cart");
      }
    } catch (error) {
      console.log("Error removing item from cart:", error);
    }
  };

  if (!cartItems || cartItems.length === 0) {
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
          {cartItems.length} item(s) in your cart
        </p>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.productId || item._id} className={styles.cartItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.itemImage}
                />

                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span>Quantity: {item.quantity}</span>
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h3>Order Summary</h3>
            <p>Price details </p>

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
