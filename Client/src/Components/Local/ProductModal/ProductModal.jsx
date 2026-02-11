import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Image,
  Upload,
  Plus,
  Star,
  Leaf,
  Drumstick,
  Zap,
  Utensils,
  Coffee,
  IceCream,
  Layers,
  Soup,
  Pizza,
} from "lucide-react";
import { toast } from "react-hot-toast";
import CustomSelect from "../../Global/CustomSelect/CustomSelect";
import styles from "./productModal.module.css";
import { BASE_URL } from "../../../utils/constant";

const CATEGORY_ICONS = {
  "Fast Food": <Zap size={16} />,
  "Junk Food": <Utensils size={16} />,
  Drinks: <Coffee size={16} />,
  Desserts: <IceCream size={16} />,
  Snacks: <Soup size={16} />,
  Combos: <Layers size={16} />,
  "Main Course": <Pizza size={16} />,
};

const CATEGORIES_LIST = [
  "Fast Food",
  "Junk Food",
  "Drinks",
  "Desserts",
  "Snacks",
  "Combos",
  "Main Course",
].map((cat) => ({
  label: cat,
  value: cat,
  icon: CATEGORY_ICONS[cat] || <Pizza size={16} />,
}));

function ProductModal({ isOpen, onClose, product, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    isPremium: false,
    isVeg: true,
    category: "Fast Food",
    hasSizes: false,
    hasPortions: false,
    sizes: { small: "", medium: "", large: "" },
    portions: { half: "", full: "" },
    discount: 0,
  });
  const [additionalImages, setAdditionalImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEditMode = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        image: product.image || "",
        description: product.description || "",
        isPremium: product.isPremium || false,
        isVeg: product.isVeg !== false,
        category: product.category || "Fast Food",
        hasSizes: product.hasSizes || false,
        hasPortions: product.hasPortions || false,
        sizes: product.sizes || { small: "", medium: "", large: "" },
        portions: product.portions || { half: "", full: "" },
        discount: product.discount || 0,
      });
      setAdditionalImages(product.images || []);
    } else {
      setFormData({
        name: "",
        price: "",
        image: "",
        description: "",
        isPremium: false,
        isVeg: true,
        category: "Fast Food",
        hasSizes: false,
        hasPortions: false,
        sizes: { small: "", medium: "", large: "" },
        portions: { half: "", full: "" },
        discount: 0,
      });
      setAdditionalImages([]);
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e, isMain = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem("token");

    try {
      if (isMain) {
        const formDataUpload = new FormData();
        formDataUpload.append("image", files[0]);

        const res = await fetch(`${BASE_URL}/upload/single`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            image: `${BASE_URL}${data.imageUrl}`,
          }));
          toast.success("Main image uploaded!");
        } else {
          toast.error("Failed to upload image");
        }
      } else {
        const formDataUpload = new FormData();
        for (let i = 0; i < files.length && i < 5; i++) {
          formDataUpload.append("images", files[i]);
        }

        const res = await fetch(`${BASE_URL}/upload/multiple`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          const newUrls = data.imageUrls.map((url) => `${BASE_URL}${url}`);
          setAdditionalImages((prev) => [...prev, ...newUrls]);
          toast.success(`${data.count} images uploaded!`);
        } else {
          toast.error("Failed to upload images");
        }
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!formData.image) {
      toast.error("Please add a main image");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const url = isEditMode
        ? `${BASE_URL}/product/update/${product._id}`
        : `${BASE_URL}/product/add`;
      const method = isEditMode ? "PUT" : "POST";

      const payload = {
        ...formData,
        discount: Number(formData.discount) || 0,
        images: additionalImages,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEditMode ? "Product updated!" : "Product added!");
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          <div className={styles.modalHeader}>
            <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.leftCol}>
                <div className={styles.imageSection}>
                  <label className={styles.sectionLabel}>Main Image *</label>
                  <div className={styles.imagePreview}>
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <Image size={40} />
                        <span>Main Image</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.imageOptions}>
                    <label className={styles.uploadBtn}>
                      <Upload size={16} />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        hidden
                      />
                    </label>
                    <span className={styles.or}>or</span>
                    <input
                      type="url"
                      placeholder="Paste image URL"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      className={styles.urlInput}
                    />
                  </div>
                </div>

                <div className={styles.imageSection}>
                  <label className={styles.sectionLabel}>
                    Additional Images (Optional)
                  </label>
                  <div className={styles.additionalImages}>
                    {additionalImages.map((img, index) => (
                      <div key={index} className={styles.additionalImageItem}>
                        <img src={img} alt={`Additional ${index + 1}`} />
                        <button
                          type="button"
                          className={styles.removeImageBtn}
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {additionalImages.length < 4 && (
                      <label className={styles.addImageBtn}>
                        <Plus size={24} />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e, false)}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className={styles.togglesSection}>
                  <div className={styles.premiumToggle}>
                    <label className={styles.toggleLabel}>
                      <input
                        type="checkbox"
                        name="isPremium"
                        checked={formData.isPremium}
                        onChange={handleChange}
                      />
                      <span className={styles.toggleSwitch}></span>
                      <span className={styles.toggleText}>
                        <Star
                          size={16}
                          fill={formData.isPremium ? "#ffc107" : "none"}
                        />
                        Mark as Premium
                      </span>
                    </label>
                  </div>

                  <div className={styles.dietToggle}>
                    <label className={styles.dietLabel}>Diet Type</label>
                    <div className={styles.dietOptions}>
                      <button
                        type="button"
                        className={`${styles.dietBtn} ${styles.vegBtn} ${formData.isVeg ? styles.active : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, isVeg: true }))
                        }
                      >
                        <Leaf size={16} /> Veg
                      </button>
                      <button
                        type="button"
                        className={`${styles.dietBtn} ${styles.nonvegBtn} ${!formData.isVeg ? styles.active : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, isVeg: false }))
                        }
                      >
                        <Drumstick size={16} /> Non-Veg
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.rightCol}>
                <div className={styles.formGroup}>
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Margherita Pizza"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <CustomSelect
                    options={CATEGORIES_LIST}
                    value={formData.category}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Price (Rs.) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="299"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Delicious pizza with fresh toppings..."
                    rows="4"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="10"
                    min="0"
                    max="100"
                  />
                </div>

                <div className={styles.sizesSection}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={formData.hasSizes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hasSizes: e.target.checked,
                        }))
                      }
                    />
                    <span className={styles.toggleSwitch}></span>
                    <span className={styles.toggleText}>
                      Enable Sizes (S/M/L)
                    </span>
                  </label>
                  {formData.hasSizes && (
                    <div className={styles.sizePrices}>
                      <div className={styles.sizeInput}>
                        <label>Small</label>
                        <input
                          type="number"
                          placeholder="Rs."
                          value={formData.sizes.small}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              sizes: { ...prev.sizes, small: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className={styles.sizeInput}>
                        <label>Medium</label>
                        <input
                          type="number"
                          placeholder="Rs."
                          value={formData.sizes.medium}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              sizes: { ...prev.sizes, medium: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className={styles.sizeInput}>
                        <label>Large</label>
                        <input
                          type="number"
                          placeholder="Rs."
                          value={formData.sizes.large}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              sizes: { ...prev.sizes, large: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.sizesSection}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={formData.hasPortions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hasPortions: e.target.checked,
                        }))
                      }
                    />
                    <span className={styles.toggleSwitch}></span>
                    <span className={styles.toggleText}>
                      Enable Portions (Half/Full)
                    </span>
                  </label>
                  {formData.hasPortions && (
                    <div className={styles.sizePrices}>
                      <div className={styles.sizeInput}>
                        <label>Half</label>
                        <input
                          type="number"
                          placeholder="Rs."
                          value={formData.portions.half}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              portions: {
                                ...prev.portions,
                                half: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className={styles.sizeInput}>
                        <label>Full</label>
                        <input
                          type="number"
                          placeholder="Rs."
                          value={formData.portions.full}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              portions: {
                                ...prev.portions,
                                full: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {uploading && (
              <div className={styles.uploadingBar}>
                <div className={styles.uploadProgress}></div>
                <span>Uploading images...</span>
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || uploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} /> {isEditMode ? "Update" : "Add Product"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProductModal;
