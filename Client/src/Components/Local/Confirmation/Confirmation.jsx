import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, CreditCard, Pizza, Home, List } from "lucide-react";
import styles from "./confirmation.module.css";
import Header from "../../Global/Header/Header";
import Footer from "../../Global/Footer/Footer";

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleViewOrders = () => {
    navigate("/my-orders");
  };

  return (
    <>
      <Header />
      <div className={styles.confirmationContainer}>
        <div className={styles.confirmationContent}>
          <div className={styles.checkmarkContainer}>
            <CheckCircle className={styles.checkmarkIcon} size={64} />
          </div>

          <h1 className={styles.confirmationTitle}>Order Confirmed!</h1>

          {orderData && (
            <div className={styles.orderDetails}>
              <p className={styles.orderId}>
                Order ID: <strong>{orderData.orderId}</strong>
              </p>

              {orderData.items && orderData.items.length > 0 && (
                <div className={styles.itemsList}>
                  {orderData.items.map((item, index) => (
                    <div key={index} className={styles.orderItem}>
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
                      <span className={styles.itemQty}>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.paymentInfo}>
                <span className={styles.codBadge}>
                  <CreditCard size={16} /> Cash on Delivery
                </span>
                <p>
                  Pay Rs. {orderData.totals?.grandTotal} when your order arrives
                </p>
              </div>
            </div>
          )}

          <p className={styles.confirmationMessage}>
            Your delicious pizza is being prepared with love!{" "}
            <Pizza size={18} />
          </p>

          <div className={styles.buttonGroup}>
            <button className={styles.ordersButton} onClick={handleViewOrders}>
              <List size={18} /> View My Orders
            </button>
            <button className={styles.homeButton} onClick={handleBackToHome}>
              <Home size={18} /> Back to Home
            </button>
          </div>

          <p className={styles.redirectMessage}>
            Redirecting to home in a few seconds...
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Confirmation;
