import React from "react";
import { motion } from "framer-motion";
import { Calendar, Info } from "lucide-react";
import styles from "./wednesdayPromo.module.css";

const WednesdayPromo = () => {
  const isWednesday = new Date().getDay() === 3;

  return (
    <section className={styles.promoSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className={styles.badge}>
            <Calendar size={14} style={{ marginRight: "8px" }} /> Weekly Special
          </div>
          <h2 className={styles.title}>
            Wednes-<span>Day</span> <br />
            Madness 1+1
          </h2>
          <p className={styles.subtitle}>
            Double the flavor, half the price! Get a second pizza absolutely
            free on every Wednesday. Midweek blues? We've got you covered with
            our exclusive BOGO treat.
          </p>

          <div className={styles.terms}>
            <Info className={styles.termIcon} size={20} />
            <span className={styles.termText}>
              Valid on Medium (M) size and above
            </span>
          </div>
        </motion.div>

        <motion.div
          className={styles.imageArea}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop"
            alt="Pizza Offer"
            className={styles.pizzaImg}
          />
          <motion.div
            className={styles.floatingOffer}
            animate={{
              y: [0, -10, 0],
              rotate: [15, 10, 15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className={styles.offerNum}>1+1</span>
            <span className={styles.offerText}>Free</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WednesdayPromo;
