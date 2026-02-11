import React from "react";
import styles from "./about.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  Leaf,
  Flame,
  Heart,
  Award,
  Clock,
  Star,
  Zap,
  ArrowRight,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={styles.aboutContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Immersive Hero Section */}
      <section className={styles.immersiveHero}>
        <div className={styles.heroOverlay}></div>
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
          alt="Artisanal Pizza"
          className={styles.bgImage}
        />
        <div className={styles.heroContent}>
          <motion.div variants={fadeInUp} className={styles.heroLabels}>
            <span className={styles.subLabel}>
              <Flame size={14} /> Established 2024
            </span>
            <span className={styles.subLabel}>
              <Star size={14} /> Premium Quality
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className={styles.heroTitle}>
            The Art of the <br /> <span>Perfect Slice</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className={styles.heroDescription}>
            We believe that great pizza is a harmony of three things: the finest
            ingredients, a respect for tradition, and a touch of technical
            innovation.
          </motion.p>
          <motion.button
            variants={fadeInUp}
            className={styles.heroButton}
            onClick={() => navigate("/product")}
          >
            Explore Menu <ArrowRight size={18} />
          </motion.button>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophySection}>
        <div className={styles.philosophyGrid}>
          <motion.div variants={fadeInUp} className={styles.philosophyText}>
            <div className={styles.accentLine}></div>
            <h2>Our Philosophy</h2>
            <p>
              At Pizzaiolo, we don't follow shortcuts. Our dough is a living
              entity, nurtured for 48 hours to develop a complex flavor and that
              signature airy, charred crust.
            </p>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4>Flash Fired</h4>
                  <p>900°F stone ovens for that authentic leopard-spotting.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <Heart size={20} />
                </div>
                <div>
                  <h4>Made with Soul</h4>
                  <p>
                    Every pizza is hand-stretched and topped with intention.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className={styles.imageComplex}>
            <div className={styles.mainImageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop"
                alt="Fresh Ingredients"
              />
            </div>
            <div className={styles.floatingTag}>
              <Award className={styles.gold} />
              <span>Certified Organic</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chef Excellence Section */}
      <section className={styles.chefExcellence}>
        <div className={styles.chefContainer}>
          <motion.div variants={fadeInUp} className={styles.chefImageWrapper}>
            <img
              src="https://i.pinimg.com/474x/1f/b0/e0/1fb0e00f4cf41162b5e50528804fd8f3.jpg"
              alt="Our Master Chef"
            />
          </motion.div>
          <motion.div variants={fadeInUp} className={styles.chefInfo}>
            <div className={styles.badge}>
              <ChefHat size={18} /> Culinary Master
            </div>
            <h3>Mastering the Elements</h3>
            <p>
              "Pizza is deceptive. It's simple in its components but infinitely
              complex in its execution. We spend our lives chasing the perfect
              hydration, the perfect acidity in our San Marzano sauce, and the
              perfect melt."
            </p>
            <div className={styles.chefBio}>
              <strong>Vision by Abhi Namdev</strong>
              <span>Lead Developer & Gastronomy Enthusiast</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Ingredients Mural */}
      <section className={styles.ingredientsMural}>
        <motion.h2 variants={fadeInUp}>The Sacred Trinity</motion.h2>
        <div className={styles.muralGrid}>
          <motion.div variants={fadeInUp} className={styles.muralItem}>
            <div className={styles.muralCircle}>
              <Leaf size={32} />
            </div>
            <h3>Double Zero Flour</h3>
            <p>
              The foundation of everything—milled in Italy for unparalleled
              texture.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className={styles.muralItem}>
            <div className={styles.muralCircle}>
              <Flame size={32} />
            </div>
            <h3>Volcanic Soil Tomatoes</h3>
            <p>
              San Marzano tomatoes grown in the mineral-rich soil of Mt.
              Vesuvius.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className={styles.muralItem}>
            <div className={styles.muralCircle}>
              <Award size={32} />
            </div>
            <h3>Buffala Mozzarella</h3>
            <p>
              Creamy, hand-torn cheese delivered fresh every single morning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Redesigned CTA */}
      <motion.section variants={fadeInUp} className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaContent}>
            <h2>Ready to Taste the Craft?</h2>
            <p>
              Your journey to the ultimate pizza experience begins with a single
              click.
            </p>
            <button
              className={styles.primeButton}
              onClick={() => navigate("/product")}
            >
              Start Your Order <Clock size={16} />
            </button>
          </div>
          <div className={styles.ctaDecoration}></div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default About;
