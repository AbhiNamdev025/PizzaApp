import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Pizza,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import styles from "./cart.module.css";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../../utils/constant";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

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

      const res = await fetch(`${BASE_URL}/cart/find`, {
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
        setCartItems([]);
      }
    } catch (error) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/cart/del/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCartItems();
        toast.success("Item Removed From Cart");
        // Notify other components (Header) to update cart count
        window.dispatchEvent(new Event("cartUpdate"));
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });

      if (res.ok) {
        setCartItems((items) =>
          items.map((item) =>
            item._id === cartItemId ? { ...item, quantity: newQuantity } : item,
          ),
        );
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      toast.error("Error updating quantity");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.cartContainer}>
          <div className={styles.loading}>
            <h2>Loading your cart...</h2>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className={styles.cartContainer}>
          <div className={styles.emptyCart}>
            <ShoppingBag size={80} color="#ddd" strokeWidth={1} />
            <h2>Your Cart is Empty</h2>
            <p>Add some delicious pizzas to get started!</p>
            <button
              className={styles.continueShopping}
              onClick={() => navigate("/home")}
            >
              <ArrowLeft size={18} /> Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.cartContainer}>
        <div className={styles.container}>
          <h1 className={styles.cartTitle}>
            <ShoppingCart size={32} /> Your Pizza Cart
          </h1>
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
                    <h3>
                      {item.name}
                      {item.size && (
                        <span className={styles.sizeBadge}>
                          {item.size.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {item.portion && (
                        <span className={styles.portionBadge}>
                          {item.portion}
                        </span>
                      )}
                    </h3>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemInfo}>
                      <span className={styles.price}>Rs.{item.price}</span>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item._id)}
                    title="Remove item"
                  >
                    <Trash2 size={20} />
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
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>

              <button
                className={styles.checkoutBtn}
                onClick={() => navigate("/order")}
              >
                <CreditCard size={20} /> Proceed to Checkout
              </button>

              <button
                className={styles.continueShopping}
                onClick={() => navigate("/home")}
              >
                <ArrowLeft size={18} /> Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
