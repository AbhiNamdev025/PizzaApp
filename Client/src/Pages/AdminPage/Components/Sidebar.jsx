import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Pizza,
  Plus,
  Home,
  LogOut,
  TrendingUp,
} from "lucide-react";
import styles from "../adminPanel.module.css";

const Sidebar = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleLogout,
  navigate,
  handleAddProduct,
}) => {
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <aside
        className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ""}`}
      >
        <motion.div
          className={styles.sidebarHeader}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2>
            <Pizza size={24} /> Pizzaiolo
          </h2>
          <span>Admin Panel</span>
        </motion.div>
        <nav className={styles.sidebarNav}>
          {[
            {
              id: "dashboard",
              icon: <LayoutDashboard size={20} />,
              label: "Dashboard",
            },
            { id: "orders", icon: <Package size={20} />, label: "Orders" },
            { id: "products", icon: <Pizza size={20} />, label: "Products" },
            {
              id: "analytics",
              icon: <TrendingUp size={20} />,
              label: "Analytics",
            },
          ].map((item, index) => (
            <motion.button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ""}`}
              onClick={() => handleNavClick(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.label}</span>
            </motion.button>
          ))}
          <motion.button
            className={styles.navItem}
            onClick={handleAddProduct}
            whileHover={{ x: 5 }}
          >
            <span className={styles.navIcon}>
              <Plus size={20} />
            </span>
            <span className={styles.navText}>Add Product</span>
          </motion.button>
          <motion.button
            className={styles.navItem}
            onClick={() => navigate("/home")}
            whileHover={{ x: 5 }}
          >
            <span className={styles.navIcon}>
              <Home size={20} />
            </span>
            <span className={styles.navText}>Go to Store</span>
          </motion.button>
        </nav>
        <motion.button
          className={styles.logoutBtn}
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} /> Logout
        </motion.button>
      </aside>

      {mobileMenuOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
