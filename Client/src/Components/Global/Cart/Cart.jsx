import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css";
import { toast } from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your cart");
        setCartItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:3535/cart/find", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data || []);
      } else {
        console.error("Failed to fetch cart items");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3535/cart/del/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCartItems();
        toast.warn("Item Removed From Cart");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to remove item");
      }
    } catch (error) {
      console.log("Error removing item from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className={styles.cartContainer}>
        <div className={styles.loading}>
          <h2>Loading your cart...</h2>
        </div>
      </div>
    );
  }

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
              <div key={item._id} className={styles.cartItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.itemImage}
                />

                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <div className={styles.itemInfo}>
                    <span className={styles.price}>Rs.{item.price}</span>
                    <span className={styles.quantity}>
                      Quantity: {item.quantity}
                    </span>
                  </div>
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
            <div className={styles.summaryDetails}>
              <p>Total Items: {cartItems.length}</p>
              <p className={styles.totalPrice}>
                Total: Rs.
                {cartItems
                  .reduce(
                    (total, item) =>
                      total + parseFloat(item.price) * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
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
