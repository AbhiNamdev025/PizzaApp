import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Check } from "lucide-react";
import styles from "./confirmModal.module.css";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.iconBox}>
            <AlertCircle size={40} className={styles.icon} />
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>

          <div className={styles.actions}>
            <button
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isLoading}
            >
              <X size={18} /> No, Cancel
            </button>
            <button
              className={styles.confirmBtn}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.loader}></div>
              ) : (
                <>
                  <Check size={18} /> Yes, Apply
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
