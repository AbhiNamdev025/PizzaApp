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
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar,
  Drawer,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import styles from "./adminPanel.module.css";
import { BASE_URL } from "../../utils/constant";
import ProductModal from "../../Components/Local/ProductModal/ProductModal";
import Sidebar from "./Components/Sidebar";
import DashboardTab from "./Components/DashboardTab";
import OrdersTab from "./Components/OrdersTab";
import ProductsTab from "./Components/ProductsTab";
import AnalyticsTab from "./Components/AnalyticsTab";
import ConfirmModal from "./Components/ConfirmModal";

function AdminPanel() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bulkDiscountValue, setBulkDiscountValue] = useState(0);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/home");
      return;
    }
    fetchData();

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

  const handleBulkDiscount = async () => {
    setIsBulkLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/product/bulk-discount`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ discount: Number(bulkDiscountValue) }),
      });

      if (res.ok) {
        toast.success(
          `Applied ${bulkDiscountValue}% discount to all products!`,
        );
        setIsConfirmOpen(false);
        fetchData();
      } else {
        toast.error("Failed to apply bulk discount");
      }
    } catch (error) {
      toast.error("Error applying bulk discount");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const onShowBulkConfirm = (value) => {
    setBulkDiscountValue(value);
    setIsConfirmOpen(true);
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        gap: 3,
        background: 'linear-gradient(135deg, #fffaf0 0%, #fff5e6 100%)'
      }}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Pizza size={80} color="#ff6f61" strokeWidth={1.5} />
        </motion.div>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#333', letterSpacing: '1px' }}>
            PREPARING DASHBOARD
          </Typography>
          <Typography variant="body2" sx={{ color: '#ff6f61', fontWeight: 600, mt: 1 }}>
            Cooking up your admin stats...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {isMobile && (
        <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #f0f0f0' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Pizza size={24} color="#ff6f61" />
              <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 800 }}>Admin</Typography>
            </Box>
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} color="primary">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
        navigate={navigate}
        handleAddProduct={handleAddProduct}
      />

      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 2, md: 4 }, 
        pt: { xs: 10, md: 4 },
        ml: { md: '260px' }, // Offset for the fixed sidebar
        width: { md: `calc(100% - 260px)` } // Ensure content fits correctly
      }}>
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
              onShowBulkConfirm={onShowBulkConfirm}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsTab orders={orders} products={products} />
          )}
        </AnimatePresence>
      </Box>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={fetchData}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleBulkDiscount}
        title="Apply Bulk Discount?"
        message={`Are you sure you want to apply a ${bulkDiscountValue}% discount to ALL products? This will overwrite individual discount values.`}
        isLoading={isBulkLoading}
      />
    </Box>
  );
}

export default AdminPanel;
