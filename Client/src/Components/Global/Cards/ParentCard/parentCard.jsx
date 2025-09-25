import React from "react";
import PizzaCard from "../PizzaCard/pizzaCard";
import styles from "./parentCard.module.css";

const ParentCard = () => {
  const pizzas = [
    {
      id: 1,
      name: "Margherita",
      price: 399,
      image:
        "https://safrescobaldistatic.blob.core.windows.net/media/2022/11/PIZZA-MARGHERITA.jpg",
      description: "Classic tomato sauce and mozzarella",
    },
    {
      id: 2,
      name: "Pepperoni",
      price: 499,
      image:
        "https://media.istockphoto.com/id/521403691/photo/hot-homemade-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=PaISuuHcJWTEVoDKNnxaHy7L2BTUkyYZ06hYgzXmTbo=",
      description: "Pepperoni with extra cheese",
    },
    {
      id: 3,
      name: "Vegetarian",
      price: 399,
      image: "https://foodoncall.co.in/wp-content/uploads/2017/09/italian.jpg",
      description: "Fresh vegetables and herbs",
    },
    {
      id: 4,
      name: "BBQ Chicken",
      price: 549,
      image: "https://www.pamperedchef.com/iceberg/com/recipe/11508-lg.jpg",
      description: "Grilled chicken with BBQ sauce",
    },
    {
      id: 5,
      name: "Hawaiian",
      price: 479,
      image:
        "https://www.allrecipes.com/thmb/v1Xi2wtebK1sZwSJitdV4MGKl1c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/hawaiian-pizza-ddmfs-3x2-132-450eff04ad924d9a9eae98ca44e3f988.jpg",
      description: "Ham and pineapple delight",
    },
    {
      id: 6,
      name: "Supreme",
      price: 599,
      image:
        "https://media.istockphoto.com/id/1477875511/photo/cu-supreme.jpg?s=612x612&w=0&k=20&c=8uyPhZlE8EYM1Ckt-z4TRWiGnbWAc3XYiTnknWtXiT4=",
      description: "All toppings loaded",
    },
  ];

  return (
    <section className={styles.parentCard}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Premium Pizzas</h2>
        <p className={styles.sectionSubtitle}>
          Handcrafted by master pizzaiolos
        </p>

        <div className={styles.pizzaGrid}>
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParentCard;
