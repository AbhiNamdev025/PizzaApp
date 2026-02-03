import React from "react";
import { motion } from "framer-motion";
import { Plus, Star, Edit, Trash2, Leaf } from "lucide-react";
import styles from "../adminPanel.module.css";

const ProductsTab = ({
  products,
  handleAddProduct,
  handleEditProduct,
  deleteProduct,
}) => {
  return (
    <motion.div
      key="products"
      className={styles.productsSection}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.sectionHeader}>
        <h1>Products ({products.length})</h1>
        <motion.button
          className={styles.addBtn}
          onClick={handleAddProduct}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} /> Add Product
        </motion.button>
      </div>

      <div className={styles.productsGrid}>
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            className={styles.productCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            {product.isPremium && (
              <div className={styles.premiumBadge}>
                <Star size={12} fill="#333" /> Premium
              </div>
            )}
            {/* Veg/Non-Veg indicator */}
            <div
              className={`${styles.dietIndicator} ${product.isVeg !== false ? styles.veg : styles.nonveg}`}
            >
              {product.isVeg !== false ? <Leaf size={10} /> : "●"}
            </div>
            <div className={styles.productImageWrapper}>
              <img src={product.image} alt={product.name} />
            </div>
            <div className={styles.productDetails}>
              <div className={styles.productTitleRow}>
                <h3>{product.name}</h3>
              </div>
              {product.category && (
                <span className={styles.categoryTag}>{product.category}</span>
              )}
              <p>{product.description}</p>
              <div className={styles.productMeta}>
                <span className={styles.productPrice}>Rs. {product.price}</span>
                {product.averageRating > 0 && (
                  <span className={styles.productRating}>
                    <Star size={14} fill="#ffc107" /> {product.averageRating}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.productCardActions}>
              <button
                className={styles.editBtn}
                onClick={() => handleEditProduct(product)}
              >
                <Edit size={16} /> Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteProduct(product._id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
        {products.length === 0 && (
          <p className={styles.noData}>No products yet. Add some!</p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsTab;
