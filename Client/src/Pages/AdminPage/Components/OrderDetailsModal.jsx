import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  MapPin,
  Mail,
  Pizza,
  IndianRupee,
  FileText,
  Trash2,
} from "lucide-react";
import styles from "../adminPanel.module.css";
import { BASE_URL } from "../../../utils/constant";

const OrderDetailsModal = ({
  order,
  onClose,
  getStatusIcon,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  handleViewBill,
  isStatusDisabled,
}) => {
  if (!order) return null;

  return (
    <div className={styles.modalOverlay}>
      <motion.div
        className={styles.modalContainer}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button className={styles.closeModalBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.modalHeader}>
          <h2>Order Details</h2>
          <span className={styles.orderIdDisplay}>{order.orderId}</span>
        </div>

        <div className={styles.modalScrollContent}>
          <div className={styles.modalSection}>
            <h3>
              <User size={18} /> Customer Info
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{order.customerName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Phone</span>
                <span className={styles.value}>{order.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{order.email || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Address</span>
                <span className={styles.value}>
                  {order.deliveryAddress}, {order.city}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.modalSection}>
            <h3>
              <Pizza size={18} /> Order Items
            </h3>
            <div className={styles.itemsListModal}>
              {order.items?.map((item, i) => (
                <div key={i} className={styles.itemRowModal}>
                  <img src={item.image} alt={item.name} />
                  <div className={styles.itemDetails}>
                    <div className={styles.itemName}>
                      {item.name}
                      <div className={styles.badges}>
                        {item.size && (
                          <span className={styles.sizeBadge}>
                            {item.size.charAt(0).toUpperCase()}
                          </span>
                        )}
                        {item.portion && (
                          <span className={styles.portionBadge}>
                            {item.portion}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={styles.itemQty}>Qty: {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalSection}>
            <h3>
              <IndianRupee size={18} /> Payment & Totals
            </h3>
            <div className={styles.totalBreakdownModal}>
              <div className={styles.breakdownRow}>
                <span>Subtotal</span>
                <span>Rs. {order.itemsTotal}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Delivery</span>
                <span>Rs. {order.deliveryCharge}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Packaging/Tax</span>
                <span>Rs. {order.tax?.toFixed(2) || 0}</span>
              </div>
              <div className={`${styles.breakdownRow} ${styles.grandTotalRow}`}>
                <span>Grand Total</span>
                <span>Rs. {order.grandTotal}</span>
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <div className={styles.statusControls}>
              <div className={styles.selectGroup}>
                <label>Status</label>
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  disabled={
                    order.orderStatus === "Delivered" ||
                    order.orderStatus === "Cancelled"
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.selectGroup}>
                <label>Payment</label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    updatePaymentStatus(order._id, e.target.value)
                  }
                  disabled={
                    order.orderStatus === "Delivered" ||
                    order.orderStatus === "Cancelled"
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.billBtn}
                onClick={() => handleViewBill(order.orderId)}
              >
                <FileText size={16} /> Bill
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  deleteOrder(order._id);
                  onClose();
                }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailsModal;
