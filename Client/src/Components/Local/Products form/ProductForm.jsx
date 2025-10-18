import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./productfrom.module.css";

function ProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3535/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const userData = await response.json();

      if (response.status === 200) {
        const token = userData.token;
        localStorage.setItem("token", token);

        console.log("Login successful:", userData);

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginHeader}>
          <h2 className={styles.loginTitle}>Add Products to Pizzaiolo</h2>
          <p className={styles.loginSubtitle}>AddMore Pizzas</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Product Name"
              className={styles.loginInput}
              name="name"
              value={formData.name}
              onChange={changeHandler}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="price"
              className={styles.loginInput}
              name="price"
              value={formData.price}
              onChange={changeHandler}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="imageLink"
              className={styles.loginInput}
              name="image"
              value={formData.image}
              onChange={changeHandler}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="description"
              className={styles.loginInput}
              name="description"
              value={formData.description}
              onChange={changeHandler}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
