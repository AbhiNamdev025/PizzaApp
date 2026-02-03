import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./hero.module.css";
import heroImage from "./hero.png";
import { Flame, Timer, Star, ShoppingCart, ClipboardList } from "lucide-react";

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
              Mastering the Art of Authentic Pizza.
            </h1>
            <p className={styles.subHeadline}>
              {subHeadlines[currentHeadline]}
            </p>

            <div className={styles.buttons}>
              <button
                className={styles.orderBtn}
                onClick={() => navigate("/order")}
              >
                <ShoppingCart size={20} /> Order Now
              </button>
              <button
                className={styles.menuBtn}
                onClick={() => navigate("/product")}
              >
                <ClipboardList size={20} /> View Menu
              </button>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <Flame className={styles.featureIcon} size={20} />
                <span>Wood-Fired</span>
              </div>
              <div className={styles.feature}>
                <Timer className={styles.featureIcon} size={20} />
                <span>30 Min</span>
              </div>
              <div className={styles.feature}>
                <Star className={styles.featureIcon} size={20} />
                <span>4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
