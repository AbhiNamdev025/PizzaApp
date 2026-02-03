import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./header.module.css";
import logoImage from "../../../assets/Images/Others/Brandlogo.ico";
import { BASE_URL } from "../../../utils/constant";
import { toast } from "react-hot-toast";
import {
  ShoppingCart,
  LogOut,
  Home,
  Info,
  Pizza,
  ClipboardList,
  ShieldCheck,
  Menu,
  X,
  User,
  Heart,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dropdownRef = React.useRef(null);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;
  const isAdmin = role === "admin";

  // Check if current path matches
  const isActive = (path) => {
    return location.pathname === path;
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
    }

    window.addEventListener("cartUpdate", fetchCartCount);
    return () => window.removeEventListener("cartUpdate", fetchCartCount);
  }, [isLoggedIn]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${BASE_URL}/cart/find`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.length);
      }
    } catch (error) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
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

        <nav
          className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}
        >
          <ul className={styles.navList}>
            <li>
              <button
                className={`${styles.navLink} ${isActive("/home") ? styles.active : ""}`}
                onClick={() => handleNavClick("/home")}
              >
                <Home className={styles.navIcon} size={20} />
                Home
              </button>
            </li>
            <li>
              <button
                className={`${styles.navLink} ${isActive("/about") ? styles.active : ""}`}
                onClick={() => handleNavClick("/about")}
              >
                <Info className={styles.navIcon} size={20} />
                About
              </button>
            </li>
            <li>
              <button
                className={`${styles.navLink} ${isActive("/product") ? styles.active : ""}`}
                onClick={() => handleNavClick("/product")}
              >
                <Pizza className={styles.navIcon} size={20} />
                Products
              </button>
            </li>
            <li>
              <button
                className={`${styles.navLink} ${isActive("/my-orders") ? styles.active : ""}`}
                onClick={() => handleNavClick("/my-orders")}
              >
                <ClipboardList className={styles.navIcon} size={20} />
                My Orders
              </button>
            </li>
            <li className={styles.mobileOnly}>
              <button
                className={`${styles.navLink} ${isActive("/wishlist") ? styles.active : ""}`}
                onClick={() => handleNavClick("/wishlist")}
              >
                <Heart className={styles.navIcon} size={20} />
                Wishlist
              </button>
            </li>
            <li className={styles.mobileOnly}>
              <button
                className={`${styles.navLink} ${isActive("/profile") ? styles.active : ""}`}
                onClick={() => handleNavClick("/profile")}
              >
                <User className={styles.navIcon} size={20} />
                Profile
              </button>
            </li>
            {isAdmin && (
              <li>
                <button
                  className={`${styles.navLink} ${styles.adminLink} ${isActive("/admin") ? styles.active : ""}`}
                  onClick={() => handleNavClick("/admin")}
                >
                  <ShieldCheck className={styles.navIcon} size={20} />
                  Admin
                </button>
              </li>
            )}
            <li className={styles.mobileOnly}>
              <div className={styles.mobileUserSection}>
                {isLoggedIn && (
                  <button
                    className={styles.mobileLogoutBtn}
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                )}
              </div>
            </li>
          </ul>
        </nav>

        <div className={styles.rightSection}>
          <div className={styles.cartWrapper}>
            <button
              className={`${styles.cartButton} ${isActive("/cart") ? styles.cartActive : ""}`}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className={styles.cartIcon} size={24} />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
          </div>

          <div className={styles.desktopOnly}>
            {isLoggedIn ? (
              <div
                className={styles.profileDropdownContainer}
                ref={dropdownRef}
              >
                <button
                  className={styles.profileIconBtn}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <User size={24} />
                </button>
                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.userEmail}>{userName}</p>
                    </div>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    >
                      <User size={18} /> My Profile
                    </button>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        navigate("/wishlist");
                        setDropdownOpen(false);
                      }}
                    >
                      <Heart size={18} /> Wishlist
                    </button>
                    <div className={styles.divider}></div>
                    <button
                      className={styles.dropdownItemLogout}
                      onClick={handleLogout}
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => navigate("/")}>
                Login
              </button>
            )}
          </div>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
