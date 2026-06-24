import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Heart, Leaf } from "lucide-react";
import {
  Button,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Paper,
  Badge,
} from "@mui/material";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Paper elevation={0} className={styles.pizzaCard}>
        <Box
          className={styles.imageContainer}
          onClick={() => navigate(`/product/${pizza._id}`)}
        >
          <img src={pizza.image} alt={pizza.name} className={styles.pizzaImage} />
          <Box className={styles.overlay}>
             <Button
                variant="contained"
                startIcon={<Eye size={16} />}
                sx={{
                   borderRadius: '50px',
                   padding: '10px 20px',
                   backgroundColor: 'white',
                   color: '#333',
                   '&:hover': {
                      backgroundColor: '#f5f5f5',
                   }
                }}
             >
                View
             </Button>
          </Box>
          <IconButton
            className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ""}`}
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <Heart size={18} fill={isWishlisted ? "#ff4757" : "none"} color={isWishlisted ? "#ff4757" : "#ff4757"} />
          </IconButton>
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
        </Box>

        <Box className={styles.cardContent}>
          <Box className={styles.ratingRow}>
            <Box className={styles.stars}>
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
            </Box>
            <Typography variant="caption" className={styles.ratingValue}>{rating}</Typography>
          </Box>

          <Typography
            variant="h5"
            className={styles.pizzaName}
            onClick={() => navigate(`/product/${pizza._id}`)}
            sx={{ fontWeight: 800, mb: 1.5, fontSize: '1.4rem' }}
          >
            {pizza.name}
          </Typography>
          <Typography variant="body2" className={styles.pizzaDescription}>{pizza.description}</Typography>

          {pizza.hasSizes && pizza.sizes && (
            <Box className={styles.sizeSelector}>
              {["small", "medium", "large"].map(
                (size) =>
                  pizza.sizes[size] > 0 && (
                    <Button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      sx={{
                        minWidth: '40px',
                        height: '40px',
                        p: 0,
                        backgroundColor: selectedSize === size ? '#ff6f61' : 'transparent',
                        color: selectedSize === size ? 'white' : '#666',
                        border: '1px solid',
                        borderColor: selectedSize === size ? '#ff6f61' : '#f0f0f0',
                        borderRadius: '10px',
                        '&:hover': {
                            backgroundColor: selectedSize === size ? '#ff6f61' : '#f5f5f5',
                        }
                      }}
                    >
                      {size === "small" ? "S" : size === "medium" ? "M" : "L"}
                    </Button>
                  ),
              )}
            </Box>
          )}

          {pizza.hasPortions && pizza.portions && (
            <Box className={styles.portionSelector}>
              {["half", "full"].map(
                (portion) =>
                  pizza.portions[portion] > 0 && (
                    <Button
                      key={portion}
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPortion(portion);
                      }}
                      sx={{
                        height: '35px',
                        textTransform: 'capitalize',
                        borderColor: selectedPortion === portion ? '#ff6f61' : '#f0f0f0',
                        color: selectedPortion === portion ? '#ff6f61' : '#666',
                        borderRadius: '20px',
                        backgroundColor: selectedPortion === portion ? 'rgba(255, 111, 97, 0.05)' : 'transparent',
                        '&:hover': {
                            borderColor: '#ff6f61',
                            backgroundColor: 'rgba(255, 111, 97, 0.1)',
                        }
                      }}
                    >
                      {portion === "half" ? "Half" : "Full"}
                    </Button>
                  ),
              )}
            </Box>
          )}

          <Box className={styles.cardFooter}>
            <Box className={styles.priceBox}>
              <Typography variant="h6" className={styles.price}>Rs. {currentPrice}</Typography>
              {discount > 0 && (
                <Typography variant="body2" className={styles.originalPrice}>Rs. {basePrice}</Typography>
              )}
            </Box>
            <Button
              variant="contained"
              startIcon={<ShoppingCart size={16} />}
              onClick={handleAddToCart}
              className={styles.addToCartBtn}
              sx={{
                borderRadius: '50px',
                padding: '10px 20px',
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default PizzaCard;
