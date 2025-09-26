import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./confirmation.module.css";

function Confirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);
  }, []);

  const handleBackToHome = () => {
    navigate("/home");
  };

  return (
    <div className={styles.confirmationContainer}>
      <div className={styles.confirmationContent}>
        <div className={styles.checkmarkContainer}>
          <FaCheckCircle className={styles.checkmarkIcon} />
        </div>

        <h1 className={styles.confirmationTitle}>Order Confirmed!</h1>
        <p className={styles.confirmationMessage}>
          Your pizza order has been successfully placed and is being prepared.
        </p>

        <button className={styles.homeButton} onClick={handleBackToHome}>
          Back to Home
        </button>

        <p className={styles.redirectMessage}>Redirecting to home</p>
      </div>
    </div>
  );
}

export default Confirmation;
