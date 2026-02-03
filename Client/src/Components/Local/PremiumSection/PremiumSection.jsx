import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PizzaCard from "../../Global/Cards/PizzaCard/pizzaCard";
import PizzaSkeleton from "../../Global/Cards/PizzaCard/PizzaSkeleton";
import styles from "./premiumSection.module.css";
import { BASE_URL } from "../../../utils/constant";
import { toast } from "react-hot-toast";

const PremiumSection = () => {
  const [premiumPizzas, setPremiumPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremium = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/find`);
        const data = await response.json();
        const filtered = data
          .filter((pizza) => pizza.isPremium === true)
          .slice(0, 3);
        setPremiumPizzas(filtered);
      } catch (error) {
        console.error("Error fetching premium pizzas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPremium();
  }, []);

  const addToCart = async (productId, pizza, cartData = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          size: cartData.size || null,
          portion: cartData.portion || null,
          customPrice: cartData.price || null,
        }),
      });
      if (res.ok) {
        toast.success(`${pizza.name} added to cart!`);
        window.dispatchEvent(new Event("cartUpdate"));
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (!loading && premiumPizzas.length === 0) return null;

  return (
    <section className={styles.premiumSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className={styles.titleIcon} size={30} />
            Premium <span>Collections</span>
          </motion.h2>
          <p className={styles.sectionSubtitle}>
            Our most exclusive, hand-crafted pizzas made with premium
            ingredients and extra love for your gourmet cravings.
          </p>
        </div>

        <div className={styles.premiumGrid}>
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => <PizzaSkeleton key={i} />)
            : premiumPizzas.map((pizza, index) => (
                <motion.div
                  key={pizza._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PizzaCard
                    pizza={pizza}
                    addToCart={(cartData) =>
                      addToCart(pizza._id, pizza, cartData)
                    }
                  />
                </motion.div>
              ))}
        </div>

        <div className={styles.viewAllContainer}>
          <Link to="/product" className={styles.viewAllLink}>
            Explore Full Menu <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
