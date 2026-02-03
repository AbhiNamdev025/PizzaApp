import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./productfrom.module.css";
import { BASE_URL } from "../../../utils/constant";
import Header from "../../Global/Header/Header";
import Footer from "../../Global/Footer/Footer";

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
      const response = await fetch(`${BASE_URL}/product/add`, {
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

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (err) {}
  };

  return (
    <>
      <Header />
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>Add Products to Pizzaiolo</h2>
            <p className={styles.loginSubtitle}>Expand our delicious menu</p>
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
                placeholder="Price (Rs. )"
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
                placeholder="Image URL"
                className={styles.loginInput}
                name="image"
                value={formData.image}
                onChange={changeHandler}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <textarea
                placeholder="Description"
                className={styles.loginInput}
                name="description"
                value={formData.description}
                onChange={changeHandler}
                required
                rows="3"
                style={{ resize: "vertical" }}
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Add Product
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductForm;
