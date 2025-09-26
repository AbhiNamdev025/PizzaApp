import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logoImage from "../../../assets/Images/Others/Brandlogo.ico";
import {
  FaCartPlus,
  FaUserMinus,
  FaHome,
  FaInfoCircle,
  FaPizzaSlice,
} from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={handleLogoClick}>
          <img
            src={logoImage}
            alt="PIZZAIOLO - Authentic Italian Pizza"
            className={styles.logoImg}
          />
          <div className={styles.logoText}>
            <h1 className={styles.brandName}>PIZZAIOLO</h1>
            <span className={styles.tagline}>Authentic Italian Pizza</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <button
                className={styles.navLink}
                onClick={() => navigate("/home")}
              >
                <FaHome className={styles.navIcon} />
                Home
              </button>
            </li>
            <li>
              <button
                className={styles.navLink}
                onClick={() => navigate("/about")}
              >
                <FaInfoCircle className={styles.navIcon} />
                About
              </button>
            </li>
            <li>
              <button
                className={styles.navLink}
                onClick={() => navigate("/products")}
              >
                <FaPizzaSlice className={styles.navIcon} />
                Products
              </button>
            </li>
          </ul>
        </nav>

        <div className={styles.rightSection}>
          <div className={styles.cartWrapper}>
            <button
              className={styles.cartButton}
              onClick={() => navigate("/cart")}
            >
              <FaCartPlus className={styles.cartIcon} />
            </button>
          </div>

          {isLoggedIn && (
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <FaUserMinus className={styles.logoutIcon} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
