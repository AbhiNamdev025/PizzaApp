import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Pizza,
  Clock,
  CheckCircle,
  Truck,
  ChefHat,
  XCircle,
  Menu,
  X,
} from "lucide-react";
import styles from "./adminPanel.module.css";
import { BASE_URL } from "../../utils/constant";
import ProductModal from "../../Components/Local/ProductModal/ProductModal";
import Sidebar from "./Components/Sidebar";
import DashboardTab from "./Components/DashboardTab";
import OrdersTab from "./Components/OrdersTab";
import ProductsTab from "./Components/ProductsTab";
import AnalyticsTab from "./Components/AnalyticsTab";

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/home");
      return;
    }
    fetchData();

    // Poll for new data every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const ordersRes = await fetch(`${BASE_URL}/order/all`, { headers });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      const productsRes = await fetch(`${BASE_URL}/product/find`);
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      const statsRes = await fetch(`${BASE_URL}/order/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/order/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderStatus: newStatus,
          ...(newStatus === "Delivered" && { paymentStatus: "Paid" }),
        }),
      });

      if (res.ok) {
        toast.success(`Order updated to ${newStatus}!`);
        fetchData();
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Error updating order");
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/order/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (res.ok) {
        toast.success(`Payment marked as ${paymentStatus}!`);
        fetchData();
      } else {
        toast.error("Failed to update payment");
      }
    } catch (error) {
      toast.error("Error updating payment");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/order/delete/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Order deleted!");
        fetchData();
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      toast.error("Error deleting order");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/product/del/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Product deleted!");
        fetchData();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <Clock size={14} />,
      Confirmed: <CheckCircle size={14} />,
      Preparing: <ChefHat size={14} />,
      "Out for Delivery": <Truck size={14} />,
      Delivered: <Package size={14} />,
      Cancelled: <XCircle size={14} />,
    };
    return icons[status] || <Clock size={14} />;
  };

  const statusOrder = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const isStatusDisabled = (currentStatus, optionStatus) => {
    if (currentStatus === "Cancelled" || currentStatus === "Delivered")
      return true;
    if (optionStatus === "Cancelled") return false;

    const currentIndex = statusOrder.indexOf(currentStatus);
    const optionIndex = statusOrder.indexOf(optionStatus);

    return optionIndex < currentIndex;
  };

  if (loading) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loading}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Pizza size={48} />
          </motion.div>
          <h2>Loading Admin Panel...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileHeaderContent}>
          <h2>
            <Pizza size={24} /> Admin
          </h2>
          <button
            className={styles.menuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
        navigate={navigate}
        handleAddProduct={handleAddProduct}
      />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <DashboardTab
              stats={stats}
              orders={orders}
              getStatusIcon={getStatusIcon}
            />
          )}
          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              fetchData={fetchData}
              getStatusIcon={getStatusIcon}
              updateOrderStatus={updateOrderStatus}
              updatePaymentStatus={updatePaymentStatus}
              deleteOrder={deleteOrder}
              isStatusDisabled={isStatusDisabled}
            />
          )}

          {activeTab === "products" && (
            <ProductsTab
              products={products}
              handleAddProduct={handleAddProduct}
              handleEditProduct={handleEditProduct}
              deleteProduct={deleteProduct}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsTab orders={orders} products={products} />
          )}
        </AnimatePresence>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={fetchData}
      />
    </div>
  );
}

export default AdminPanel;
