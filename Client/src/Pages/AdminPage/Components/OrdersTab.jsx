import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  User,
  Filter,
  Eye,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  Flame,
} from "lucide-react";
import styles from "../adminPanel.module.css";
import BillReceipt from "../../../Components/Global/BillReceipt/BillReceipt";
import OrderDetailsModal from "./OrderDetailsModal";
import CustomSelect from "../../../Components/Global/CustomSelect/CustomSelect";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../../utils/constant";

const OrdersTab = ({
  orders,
  fetchData,
  getStatusIcon,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  isStatusDisabled,
}) => {
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedBill, setSelectedBill] = useState(null);
  const [generatingBill, setGeneratingBill] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewBill = async (orderId) => {
    setGeneratingBill(true);
    try {
      const res = await fetch(`${BASE_URL}/bill/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedBill(data.bill);
      } else {
        toast.error("Failed to generate bill");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setGeneratingBill(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (filterType === "today") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (filterType === "week") {
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        return orderDate >= lastWeek;
      }
      if (filterType === "month") {
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);
        return orderDate >= lastMonth;
      }
      if (filterType === "custom" && dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }
      return true;
    });
  }, [orders, filterType, dateRange]);

  return (
    <motion.div
      key="orders"
      className={styles.ordersSection}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        {selectedBill && (
          <BillReceipt
            bill={selectedBill}
            onClose={() => setSelectedBill(null)}
            isAdmin={true}
          />
        )}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            getStatusIcon={getStatusIcon}
            updateOrderStatus={updateOrderStatus}
            updatePaymentStatus={updatePaymentStatus}
            deleteOrder={deleteOrder}
            handleViewBill={handleViewBill}
            isStatusDisabled={isStatusDisabled}
          />
        )}
      </AnimatePresence>

      <div className={styles.sectionHeader}>
        <h1>All Orders ({filteredOrders.length})</h1>

        <div className={styles.filterControls}>
          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.filterIcon} />
            <CustomSelect
              options={[
                { label: "All Time", value: "all", icon: <Clock size={14} /> },
                {
                  label: "Today",
                  value: "today",
                  icon: <RefreshCw size={14} />,
                },
                {
                  label: "Last 7 Days",
                  value: "week",
                  icon: <Calendar size={14} />,
                },
                {
                  label: "Last 30 Days",
                  value: "month",
                  icon: <Calendar size={14} />,
                },
                {
                  label: "Custom Range",
                  value: "custom",
                  icon: <Filter size={14} />,
                },
              ]}
              value={filterType}
              onChange={setFilterType}
              className={styles.filterCustomSelect}
            />
          </div>

          {filterType === "custom" && (
            <div className={styles.customDateInputs}>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className={styles.dateInput}
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className={styles.dateInput}
              />
            </div>
          )}

          <button className={styles.refreshBtn} onClick={fetchData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className={styles.ordersList}>
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order._id}
            className={styles.orderCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedOrder(order)}
            style={{ cursor: "pointer" }}
            whileHover={{ y: -2 }}
          >
            <div className={styles.minCardHeader}>
              <div className={styles.minId}>
                <span className={styles.hash}>#</span>
                {order.orderId}
              </div>
              <span
                className={`${styles.minStatusBadge} ${
                  styles[order.orderStatus?.toLowerCase().replace(/ /g, "")]
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className={styles.minCardBody}>
              <div className={styles.minInfoRow}>
                <User size={14} color="#666" />
                <span>{order.customerName}</span>
              </div>
              <div className={styles.minInfoRow}>
                <Calendar size={14} color="#666" />
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={styles.minCardFooter}>
              <div className={styles.cardActions}>
                <CustomSelect
                  options={[
                    {
                      label: "Pending",
                      value: "Pending",
                      icon: <Clock size={14} color="#f1c40f" />,
                    },
                    {
                      label: "Confirmed",
                      value: "Confirmed",
                      icon: <CheckCircle size={14} color="#3498db" />,
                    },
                    {
                      label: "Preparing",
                      value: "Preparing",
                      icon: <Flame size={14} color="#e67e22" />,
                    },
                    {
                      label: "Out For Delivery",
                      value: "Out for Delivery",
                      icon: <Truck size={14} color="#9b59b6" />,
                    },
                    {
                      label: "Delivered",
                      value: "Delivered",
                      icon: <Package size={14} color="#2ecc71" />,
                    },
                    {
                      label: "Cancelled",
                      value: "Cancelled",
                      icon: <XCircle size={14} color="#e74c3c" />,
                    },
                  ]}
                  value={order.orderStatus}
                  onChange={(val) => updateOrderStatus(order._id, val)}
                  disabled={
                    order.orderStatus === "Delivered" ||
                    order.orderStatus === "Cancelled"
                  }
                  className={styles.miniStatusSelectCustom}
                />

                <button
                  className={styles.miniBillBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewBill(order.orderId);
                  }}
                  title="Print Bill"
                >
                  <FileText size={14} />
                </button>
              </div>

              <div className={styles.minTotal}>
                <strong>Rs. {order.grandTotal}</strong>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredOrders.length === 0 && (
          <p className={styles.noData}>
            No orders found for the selected period.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default OrdersTab;
