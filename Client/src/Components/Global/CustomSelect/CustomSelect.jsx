import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./customSelect.module.css";
import { motion, AnimatePresence } from "framer-motion";

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleOptionClick = (optionValue) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) =>
    typeof opt === "string" ? opt === value : opt.value === value,
  );

  const displayValue = selectedOption
    ? typeof selectedOption === "string"
      ? selectedOption
      : selectedOption.label
    : placeholder;

  const displayIcon =
    selectedOption && typeof selectedOption !== "string"
      ? selectedOption.icon
      : null;

  return (
    <div
      className={`${styles.customSelect} ${className} ${isOpen ? styles.active : ""} ${disabled ? styles.disabled : ""}`}
      ref={selectRef}
    >
      <div
        className={styles.selectHeader}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onBlur={() => {
          // Optional: close on blur if needed, but handleClickOutside usually handles it
        }}
      >
        <div className={styles.headerValue}>
          {displayIcon && (
            <span className={styles.headerIcon}>{displayIcon}</span>
          )}
          <span className={styles.selectedValue}>{displayValue}</span>
        </div>
        <ChevronDown
          size={18}
          className={`${styles.arrow} ${isOpen ? styles.rotate : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.optionsList}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {options.map((option, index) => {
              const optValue =
                typeof option === "string" ? option : option.value;
              const optLabel =
                typeof option === "string" ? option : option.label;
              const optIcon = typeof option === "string" ? null : option.icon;
              const isSelected = optValue === value;

              return (
                <div
                  key={index}
                  className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                  onClick={() => handleOptionClick(optValue)}
                >
                  <div className={styles.optionContent}>
                    {optIcon && (
                      <span className={styles.optionIcon}>{optIcon}</span>
                    )}
                    <span className={styles.optionLabel}>{optLabel}</span>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Check size={14} className={styles.checkIcon} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
