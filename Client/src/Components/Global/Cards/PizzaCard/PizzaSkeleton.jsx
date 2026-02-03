import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./pizzaCard.module.css";

const PizzaSkeleton = () => {
  return (
    <div className={styles.pizzaCard} style={{ cursor: "default" }}>
      <div className={styles.imageContainer}>
        <Skeleton height="200px" width="100%" borderRadius="15px 15px 0 0" />
      </div>
      <div className={styles.cardContent}>
        <div style={{ marginBottom: "1rem" }}>
          <Skeleton width="60%" height={24} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <Skeleton count={2} />
        </div>
        <div className={styles.cardFooter}>
          <Skeleton width="40%" height={24} />
          <Skeleton width="30%" height={36} borderRadius="20px" />
        </div>
      </div>
    </div>
  );
};

export default PizzaSkeleton;
