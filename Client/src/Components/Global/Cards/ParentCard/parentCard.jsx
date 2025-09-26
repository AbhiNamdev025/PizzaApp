import React, { useState, useEffect } from "react";
import PizzaCard from "../PizzaCard/pizzaCard";
import styles from "./parentCard.module.css";
import { toast } from "react-toastify";

const ParentCard = () => {
  const [pizzas, setPizzas] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:2525/product/find");
      const data = await response.json();
      setPizzas(data);
    } catch (error) {
      console.error("Problem in fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const addToCart = (pizza) => {
    toast.success(`${pizza.name} added to the cart!`);
  };

  
  return (
    <section className={styles.parentCard}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Premium Pizzas</h2>
        <p className={styles.sectionSubtitle}>
          Handcrafted by master pizzaiolos
        </p>

        <div className={styles.pizzaGrid}>
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParentCard;
