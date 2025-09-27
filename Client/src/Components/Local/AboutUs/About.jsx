import React from 'react';
import styles from './about.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.heading}>About Us</h1>
      <p className={styles.description}>
        Welcome to <strong>Pizzaiolo</strong> – your ultimate destination for fast, fresh, and delicious pizza at your fingertips!
      </p>

      <section className={styles.section}>
        <h2 className={styles.subheading}>🍕 What We Offer</h2>
        <ul className={styles.list}>
          <li>A wide selection of classic and gourmet pizzas</li>
          <li>Easy customization with your favorite toppings and crusts</li>
          <li>Smooth, intuitive ordering process</li>
          <li>Real-time order updates</li>
          <li>Safe and secure checkout</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>🚀 Why Pizzaiolo?</h2>
        <p>
          We’re more than just an ordering app. We’re building a smarter way to satisfy your pizza cravings.
          Behind the scenes, our system is powered by modern technology that ensures speed, accuracy,
          and reliability with every order.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>🛠️ Built with Passion</h2>
        <p>
          Pizzaiolo was designed and developed by <strong>Abhi Namdev</strong> to merge great food
          experiences with clean, efficient tech. Every piece — from UI to backend — is built with
          performance and ease in mind.
        </p>
      </section>

      <div className={styles.callToAction}>
        <h3>Hungry Yet?</h3>
        <p>Build your perfect pizza now – fresh ingredients, fast delivery, and flavor guaranteed!</p>
      </div>
    </div>
  );
};

export default About;
