import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Heart, Leaf } from "lucide-react";
import { BASE_URL } from "../../../../utils/constant";
import { toast } from "react-hot-toast";
import styles from "./pizzaCard.module.css";

const PizzaCard = ({ pizza, addToCart }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedPortion, setSelectedPortion] = useState("full");

  React.useEffect(() => {
    checkIfWishlisted();
  }, [pizza._id]);

  const checkIfWishlisted = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/wishlist/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const wishlist = await res.json();
        setIsWishlisted(wishlist.some((item) => item._id === pizza._id));
      }
    } catch (error) {}
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to wishlist items");
      return;
    }

    setWishlistLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: pizza._id }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsWishlisted(data.isWishlisted);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error("Error updating wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const rating = pizza.averageRating || (4 + Math.random()).toFixed(1);

  const getBasePrice = () => {
    if (pizza.hasSizes && pizza.sizes) {
      return pizza.sizes[selectedSize] || pizza.price;
    }
    if (pizza.hasPortions && pizza.portions) {
      return pizza.portions[selectedPortion] || pizza.price;
    }
    return pizza.price;
  };

  const basePrice = Number(getBasePrice());
  const discount = Number(pizza.discount) || 0;
  const currentPrice =
    discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartData = {
      size: pizza.hasSizes ? selectedSize : null,
      portion: pizza.hasPortions ? selectedPortion : null,
      price: currentPrice,
    };
    addToCart(cartData);
  };

  return (
    <motion.div
      className={styles.pizzaCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)" }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={styles.imageContainer}
        onClick={() => navigate(`/product/${pizza._id}`)}
      >
        <img src={pizza.image} alt={pizza.name} className={styles.pizzaImage} />
        <div className={styles.overlay}>
          <motion.button
            className={styles.viewBtn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye size={16} /> View
          </motion.button>
        </div>
        <button
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ""}`}
          onClick={toggleWishlist}
          disabled={wishlistLoading}
        >
          <Heart size={18} fill={isWishlisted ? "#ff4757" : "none"} />
        </button>
        {Number(pizza.discount) > 0 && (
          <div className={styles.discountBadge}>
            {Number(pizza.discount)}% OFF
          </div>
        )}
        {pizza.isPremium ? (
          <div className={`${styles.badge} ${styles.premiumBadge}`}>
            <Star size={12} fill="#333" /> Premium
          </div>
        ) : (
          <div className={styles.badge}>
            <Star size={12} /> Popular
          </div>
        )}

        <div
          className={`${styles.dietBadge} ${pizza.isVeg !== false ? styles.vegBadge : styles.nonvegBadge}`}
        >
          <span className={styles.dietDot}></span>
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.round(rating)
                    ? styles.starFilled
                    : styles.starEmpty
                }
                fill={star <= Math.round(rating) ? "#ffc107" : "none"}
              />
            ))}
          </div>
          <span className={styles.ratingValue}>{rating}</span>
          {Number(pizza.discount) > 0 && (
            <span className={styles.cardDiscountTag}>-{pizza.discount}%</span>
          )}
        </div>

        <h3
          className={styles.pizzaName}
          onClick={() => navigate(`/product/${pizza._id}`)}
        >
          {pizza.name}
        </h3>
        <p className={styles.pizzaDescription}>{pizza.description}</p>

        {pizza.hasSizes && pizza.sizes && (
          <div className={styles.sizeSelector}>
            {["small", "medium", "large"].map(
              (size) =>
                pizza.sizes[size] > 0 && (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                  >
                    {size === "small" ? "S" : size === "medium" ? "M" : "L"}
                  </button>
                ),
            )}
          </div>
        )}

        {pizza.hasPortions && pizza.portions && (
          <div className={styles.portionSelector}>
            {["half", "full"].map(
              (portion) =>
                pizza.portions[portion] > 0 && (
                  <button
                    key={portion}
                    className={`${styles.portionBtn} ${selectedPortion === portion ? styles.portionActive : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPortion(portion);
                    }}
                  >
                    {portion === "half" ? "Half" : "Full"}
                  </button>
                ),
            )}
          </div>
        )}

        <div className={styles.cardFooter}>
          <div className={styles.priceBox}>
            <span className={styles.price}>Rs. {currentPrice}</span>
            {discount > 0 && (
              <span className={styles.originalPrice}>Rs. {basePrice}</span>
            )}
          </div>
          <motion.button
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={16} /> Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;
