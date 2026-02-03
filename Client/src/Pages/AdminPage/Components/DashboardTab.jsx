import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  ChefHat,
  Truck,
  CheckCircle,
  IndianRupee,
} from "lucide-react";
import styles from "../adminPanel.module.css";

const DashboardTab = ({ stats, orders, getStatusIcon }) => {
  return (
    <motion.div
      key="dashboard"
      className={styles.dashboard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>Dashboard Overview</h1>
      <div className={styles.statsGrid}>
        {[
          {
            icon: <Package size={28} />,
            value: stats?.totalOrders || 0,
            label: "Total Orders",
          },
          {
            icon: <Clock size={28} />,
            value: stats?.pendingOrders || 0,
            label: "Pending",
          },
          {
            icon: <ChefHat size={28} />,
            value: stats?.preparingOrders || 0,
            label: "Preparing",
          },
          {
            icon: <Truck size={28} />,
            value: stats?.outForDeliveryOrders || 0,
            label: "Delivery",
          },
          {
            icon: <CheckCircle size={28} />,
            value: stats?.deliveredOrders || 0,
            label: "Delivered",
          },
          {
            icon: <IndianRupee size={28} />,
            value: `Rs. ${stats?.totalRevenue?.toFixed(0) || 0}`,
            label: "Revenue",
            isRevenue: true,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className={`${styles.statCard} ${stat.isRevenue ? styles.revenueCard : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <span className={styles.statIcon}>{stat.icon}</span>
            <div className={styles.statInfo}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.recentOrders}>
        <h2>Recent Orders</h2>
        <div className={styles.ordersTableWrapper}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td className={styles.orderId}>{order.orderId?.slice(-8)}</td>
                  <td>{order.customerName}</td>
                  <td className={styles.amount}>Rs. {order.grandTotal}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[order.orderStatus?.toLowerCase().replace(/ /g, "")]}`}
                    >
                      {getStatusIcon(order.orderStatus)} {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.paymentBadge} ${order.paymentStatus === "Paid" ? styles.paid : styles.unpaid}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View for Recent Orders */}
          <div className={styles.mobileOrdersList}>
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className={styles.mobileOrderCard}>
                <div className={styles.mobileOrderHeader}>
                  <span className={styles.orderId}>
                    {order.orderId?.slice(-8)}
                  </span>
                  <span className={styles.amount}>Rs. {order.grandTotal}</span>
                </div>
                <div className={styles.mobileOrderInfo}>
                  <p>{order.customerName}</p>
                </div>
                <div className={styles.mobileOrderFooter}>
                  <span
                    className={`${styles.statusBadge} ${styles[order.orderStatus?.toLowerCase().replace(/ /g, "")]}`}
                  >
                    {getStatusIcon(order.orderStatus)} {order.orderStatus}
                  </span>
                  <span
                    className={`${styles.paymentBadge} ${order.paymentStatus === "Paid" ? styles.paid : styles.unpaid}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardTab;
