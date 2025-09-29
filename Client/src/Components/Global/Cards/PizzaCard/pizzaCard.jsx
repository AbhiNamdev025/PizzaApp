import React from "react";
import styles from "./pizzaCard.module.css";

const PizzaCard = ({ pizza, addToCart  }) => {
  return (
    <div className={styles.pizzaCard}>
      <div className={styles.imageContainer}>
        <img src={pizza.image} alt={pizza.name} className={styles.pizzaImage} />
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.pizzaName}>{pizza.name}</h3>
        <p className={styles.pizzaDescription}>{pizza.description}</p>

        <div className={styles.cardFooter}>
          <span className={styles.price}>₹{pizza.price}</span>
          <button className={styles.addToCartBtn} onClick={addToCart}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;
