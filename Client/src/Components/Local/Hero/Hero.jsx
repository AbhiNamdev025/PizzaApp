import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./hero.module.css";
import heroImage from "./hero.png";

const HeroSection = () => {
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const navigate = useNavigate();

  const subHeadlines = [
    "Handcrafted by our master chef using traditional techniques",
    "From our wood-fired oven directly to your doorstep",
    "100% authentic recipes passed down through generations",
    "Experience pizza perfection with every single bite",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((i) => (i + 1) % subHeadlines.length);
    }, 3000);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            <div className={styles.pizzaContainer}>
              <img
                src={heroImage}
                alt="Premium Pizzaiolo Pizza"
                className={styles.pizzaImage}
              />
            </div>
          </div>

          <div className={styles.textSection}>
            <h1 className={styles.headline}>
              An Italian term for a pizza maker, giving it a premium feel.
            </h1>
            <p className={styles.subHeadline}>
              {subHeadlines[currentHeadline]}
            </p>

            <div className={styles.buttons}>
              <button
                className={styles.orderBtn}
                onClick={() => navigate("/order")}
              >
                🍕 Order Now
              </button>
              <button
                className={styles.menuBtn}
                onClick={() => navigate("/product")}
              >
                📋 View Menu
              </button>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🔥</span>
                <span>Wood-Fired Oven</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>⏱️</span>
                <span>30 Min Delivery</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>⭐</span>
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
