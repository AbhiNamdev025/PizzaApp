import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Package,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  Pizza,
  ShoppingBag,
  FileText,
} from "lucide-react";
import styles from "./myOrders.module.css";
import { BASE_URL } from "../../utils/constant";
import Header from "../../Components/Global/Header/Header";
import Footer from "../../Components/Global/Footer/Footer";
import BillReceipt from "../../Components/Global/BillReceipt/BillReceipt";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [generatingBill, setGeneratingBill] = useState(false);

  useEffect(() => {
    fetchOrders();

    // Poll for order updates every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view orders");
        navigate("/");
        return;
      }

      const res = await fetch(`${BASE_URL}/order/my-orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewBill = async (orderId) => {
    setGeneratingBill(true);
    try {
      const res = await fetch(`${BASE_URL}/bill/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedBill(data.bill);
      } else {
        toast.error("Failed to generate bill");
      }
    } catch (error) {
      console.error("Bill generation error:", error);
      toast.error("Something went wrong");
    } finally {
      setGeneratingBill(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "#ffc107",
      Confirmed: "#28a745",
      Preparing: "#17a2b8",
      "Out for Delivery": "#6f42c1",
      Delivered: "#28a745",
      Cancelled: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>
            <h2>Loading your orders...</h2>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {selectedBill && (
        <BillReceipt
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}

      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>My Orders</h1>
          <p className={styles.subtitle}>Track all your pizza orders</p>

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <ShoppingBag size={64} color="#ddd" />
              </div>
              <h2>No orders yet</h2>
              <p>Your delicious pizza orders will appear here</p>
              <button
                className={styles.shopBtn}
                onClick={() => navigate("/home")}
              >
                Order Now
              </button>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderId}>
                      <h3>{order.orderId}</h3>
                      <span className={styles.date}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={styles.status}
                      style={{
                        backgroundColor: getStatusColor(order.orderStatus),
                      }}
                    >
                      {order.orderStatus}
                    </div>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item, i) => (
                      <div key={i} className={styles.item}>
                        <img src={item.image} alt={item.name} />
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>
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
                          </span>
                          <span className={styles.itemQty}>
                            x{item.quantity}
                          </span>
                        </div>
                        <span className={styles.itemPrice}>
                          Rs. {item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.deliveryInfo}>
                      <p>
                        <MapPin size={14} /> <strong>Delivery:</strong>{" "}
                        {order.deliveryAddress}, {order.city}
                      </p>
                      <p>
                        <CreditCard size={14} /> <strong>Payment:</strong>{" "}
                        {order.paymentMethod} ({order.paymentStatus})
                      </p>
                    </div>
                    <div className={styles.footerRight}>
                      <div className={styles.total}>
                        <span>Total</span>
                        <strong>Rs. {order.grandTotal}</strong>
                      </div>
                      {order.orderStatus === "Delivered" && (
                        <button
                          className={styles.billBtn}
                          onClick={() => handleViewBill(order.orderId)}
                          disabled={generatingBill}
                        >
                          <FileText size={16} />
                          {generatingBill ? "..." : "View Bill"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyOrders;
