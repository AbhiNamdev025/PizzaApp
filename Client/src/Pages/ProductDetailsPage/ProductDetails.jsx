import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Clock,
  Truck,
  Shield,
  Minus,
  Plus,
  Send,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  Paper,
  Rating,
  Divider,
  Container,
  Avatar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import styles from "./productDetails.module.css";
import { BASE_URL } from "../../utils/constant";
import Header from "../../Components/Global/Header/Header";
import Footer from "../../Components/Global/Footer/Footer";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedPortion, setSelectedPortion] = useState("full");
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${BASE_URL}/product/get/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        toast.error("Product not found");
        navigate("/product");
      }
    } catch (error) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const getBasePrice = () => {
    if (!product) return 0;
    if (product.hasSizes && product.sizes) {
      return product.sizes[selectedSize] || product.price;
    }
    if (product.hasPortions && product.portions) {
      return product.portions[selectedPortion] || product.price;
    }
    return product.price;
  };

  const basePrice = Number(getBasePrice());
  const discountAmount = Number(product?.discount) || 0;
  const currentPrice =
    discountAmount > 0
      ? Math.round(basePrice * (1 - discountAmount / 100))
      : basePrice;

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add items to cart");
        navigate("/");
        return;
      }

      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: currentPrice,
          image: product.image,
          description: product.description,
          quantity: quantity,
          size: product.hasSizes ? selectedSize : null,
          portion: product.hasPortions ? selectedPortion : null,
        }),
      });

      if (res.ok) {
        toast.success(`${quantity} ${product.name} added to cart!`);

        window.dispatchEvent(new Event("cartUpdate"));
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const submitRating = async () => {
    if (!userRating) {
      toast.error("Please select a rating");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add a review");
      navigate("/");
      return;
    }

    setSubmittingRating(true);
    try {
      const res = await fetch(`${BASE_URL}/rating/add/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: userRating,
          review: reviewText,
        }),
      });

      if (res.ok) {
        toast.success("Review submitted!");
        setUserRating(0);
        setReviewText("");
        fetchProduct();
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      toast.error("Error submitting review");
    } finally {
      setSubmittingRating(false);
    }
  };

  const allImages = product
    ? [...new Set([product.image, ...(product.images || [])])].filter(Boolean)
    : [];

  if (loading) {
    return (
      <>
        <Header />
        <Box className={styles.container}>
          <Box className={styles.productWrapper}>
            <Box className={styles.imageSection}>
              <Skeleton height={400} borderRadius={20} />
              <div className={styles.thumbnails} style={{ marginTop: "1rem" }}>
                <Skeleton
                  width={80}
                  height={80}
                  borderRadius={10}
                  count={3}
                  containerClassName={styles.thumbnails}
                />
              </div>
            </Box>
            <Box className={styles.infoSection}>
              <Skeleton
                height={40}
                width="80%"
                style={{ marginBottom: "1rem" }}
              />
              <Skeleton
                height={20}
                width="40%"
                style={{ marginBottom: "2rem" }}
              />
              <Skeleton count={3} style={{ marginBottom: "1rem" }} />
              <div style={{ marginTop: "2rem" }}>
                <Skeleton height={50} width="100%" borderRadius={12} />
              </div>
            </Box>
          </Box>
        </Box>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  const totalRating = product.averageRating || 0;
  const reviewLinksCount = product.ratings?.length || 0;

  const nextReview = () => {
    if (product.ratings && product.ratings.length > 1) {
      setCurrentReviewIndex((prev) => (prev + 1) % product.ratings.length);
    }
  };

  const prevReview = () => {
    if (product.ratings && product.ratings.length > 1) {
      setCurrentReviewIndex((prev) =>
        prev === 0 ? product.ratings.length - 1 : prev - 1,
      );
    }
  };

  return (
    <>
      <Header />
      <Box className={styles.container}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, textTransform: 'none', color: '#666' }}
        >
          Back
        </Button>

        <Box className={styles.productWrapper}>
          <motion.div
            className={styles.imageSection}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={0} className={styles.imageContainer} sx={{ position: 'relative', overflow: 'hidden' }}>
              <motion.img
                src={allImages[activeImage] || product.image}
                alt={product.name}
                className={styles.productImage}
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <IconButton
                className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`}
                onClick={() => setIsLiked(!isLiked)}
                sx={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <Heart size={20} fill={isLiked ? "#e74c3c" : "none"} color="#e74c3c" />
              </IconButton>
              {product.isPremium && (
                <Box className={styles.premiumBadge}>
                  <Star size={14} fill="#333" /> Premium
                </Box>
              )}
            </Paper>

            {allImages.length > 1 && (
              <Box className={styles.thumbnails}>
                {allImages.map((img, index) => (
                  <Box
                    key={index}
                    className={`${styles.thumbnail} ${activeImage === index ? styles.active : ""}`}
                    onClick={() => setActiveImage(index)}
                    component="button"
                    sx={{
                       border: activeImage === index ? '2px solid #ff6f61' : '2px solid transparent',
                       borderRadius: '12px',
                       overflow: 'hidden',
                       p: 0,
                       cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt={`View ${index + 1}`} />
                  </Box>
                ))}
              </Box>
            )}

            <div className={styles.imageSelectionArea}>
              {product.hasSizes && product.sizes && (
                <Box className={styles.selectionSection}>
                  <Typography variant="h6" className={styles.selectionTitle}>Select Size</Typography>
                  <Box className={styles.sizeSelector}>
                    {["small", "medium", "large"].map(
                      (size) =>
                        product.sizes[size] > 0 && (
                          <Button
                            key={size}
                            variant="outlined"
                            onClick={() => setSelectedSize(size)}
                            sx={{
                               flex: 1,
                               flexDirection: 'column',
                               height: 'auto',
                               py: 1.5,
                               borderRadius: '12px',
                               borderColor: selectedSize === size ? '#ff6f61' : '#f0f0f0',
                               color: selectedSize === size ? '#ff6f61' : '#666',
                               backgroundColor: selectedSize === size ? 'rgba(255,111,97,0.05)' : 'transparent',
                               '&:hover': {
                                  borderColor: '#ff6f61',
                                  backgroundColor: 'rgba(255,111,97,0.1)'
                               }
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {size === "small" ? "Small" : size === "medium" ? "Medium" : "Large"}
                            </Typography>
                            <Typography variant="caption">Rs. {product.sizes[size]}</Typography>
                          </Button>
                        ),
                    )}
                  </Box>
                </Box>
              )}

              {product.hasPortions && product.portions && (
                <Box className={styles.selectionSection}>
                  <Typography variant="h6" className={styles.selectionTitle}>Select Portion</Typography>
                  <Box className={styles.portionSelector}>
                    {["half", "full"].map(
                      (portion) =>
                        product.portions[portion] > 0 && (
                          <Button
                            key={portion}
                            variant="outlined"
                            onClick={() => setSelectedPortion(portion)}
                            sx={{
                               flex: 1,
                               flexDirection: 'column',
                               height: 'auto',
                               py: 1.5,
                               borderRadius: '12px',
                               borderColor: selectedPortion === portion ? '#ff6f61' : '#f0f0f0',
                               color: selectedPortion === portion ? '#ff6f61' : '#666',
                               backgroundColor: selectedPortion === portion ? 'rgba(255,111,97,0.05)' : 'transparent',
                               '&:hover': {
                                  borderColor: '#ff6f61',
                                  backgroundColor: 'rgba(255,111,97,0.1)'
                               }
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {portion === "half" ? "Half" : "Full"}
                            </Typography>
                            <Typography variant="caption">Rs. {product.portions[portion]}</Typography>
                          </Button>
                        ),
                    )}
                  </Box>
                </Box>
              )}
            </div>
          </motion.div>

          <motion.div
            className={styles.infoSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h1" className={styles.productName}>{product.name}</Typography>

            <Box className={styles.ratingRow} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={totalRating} precision={0.5} readOnly size="medium" />
              <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                ({reviewLinksCount} reviews)
              </Typography>
            </Box>

            <Typography variant="body1" className={styles.description} sx={{ mb: 3 }}>{product.description}</Typography>

            <Box className={styles.metaInfo}>
              <Box className={styles.metaItem} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Clock size={16} style={{ marginRight: '8px' }} />
                <Typography variant="body2">20-30 mins delivery</Typography>
              </Box>
              <Box className={styles.metaItem} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Truck size={16} style={{ marginRight: '8px' }} />
                <Typography variant="body2">Free delivery over Rs. 500</Typography>
              </Box>
              <Box className={styles.metaItem} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Shield size={16} style={{ marginRight: '8px' }} />
                <Typography variant="body2">Quality guaranteed</Typography>
              </Box>
            </Box>

            <Box className={styles.priceSection} sx={{ my: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>Rs. {currentPrice}</Typography>
              {discountAmount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ textDecoration: 'line-through', color: '#999' }}>Rs. {basePrice}</Typography>
                  <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>{discountAmount}% OFF</Typography>
                </Box>
              )}
            </Box>

            <Box className={styles.quantitySection} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 600 }}>Quantity:</Typography>
              <Box className={styles.quantityControls} sx={{ display: 'flex', alignItems: 'center', border: '1px solid #f0f0f0', borderRadius: '50px', p: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  sx={{ backgroundColor: '#f5f5f5' }}
                >
                  <Minus size={16} />
                </IconButton>
                <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center', fontWeight: 600 }}>{quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange("increase")}
                  sx={{ backgroundColor: '#f5f5f5' }}
                >
                  <Plus size={16} />
                </IconButton>
              </Box>
            </Box>

            <Box className={styles.totalPrice} sx={{ mb: 4 }}>
              <Typography variant="h6">Total: <span style={{ color: '#ff6f61', fontWeight: 700 }}>Rs. {currentPrice * quantity}</span></Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCart size={22} />}
              onClick={addToCart}
              sx={{
                 height: '60px',
                 borderRadius: '15px',
                 fontSize: '1.2rem',
                 background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
                 boxShadow: '0 8px 20px rgba(255,111,97,0.3)',
                 mb: 4
              }}
            >
              Add to Cart
            </Button>

            <Divider sx={{ mb: 4 }} />

            <Box className={styles.features} sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box className={styles.feature} sx={{ textAlign: 'center' }}>
                <Clock size={24} />
                <Typography variant="caption" display="block">Fresh & Hot</Typography>
              </Box>
              <Box className={styles.feature} sx={{ textAlign: 'center' }}>
                <Truck size={24} />
                <Typography variant="caption" display="block">Fast Delivery</Typography>
              </Box>
              <Box className={styles.feature} sx={{ textAlign: 'center' }}>
                <Shield size={24} />
                <Typography variant="caption" display="block">Best Quality</Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>

        <Paper elevation={0} className={styles.addReviewSection} sx={{ mt: 6, p: 4, borderRadius: '20px', border: '1px solid #f0f0f0' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Rate this Product</Typography>
          <Box className={styles.ratingInput} sx={{ mb: 3 }}>
            <Rating
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              size="large"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" sx={{ color: '#666' }}>
              {userRating > 0 ? `${userRating} Star${userRating > 1 ? "s" : ""}` : "Select rating"}
            </Typography>
          </Box>
          <TextField
             fullWidth
             multiline
             rows={4}
             variant="outlined"
             placeholder="Write your review (optional)..."
             value={reviewText}
             onChange={(e) => setReviewText(e.target.value)}
             sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                   borderRadius: '12px',
                   backgroundColor: '#fafafa'
                }
             }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={submitRating}
            disabled={submittingRating || !userRating}
            startIcon={submittingRating ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
            sx={{
               borderRadius: '12px',
               px: 4,
               py: 1.5,
               background: 'linear-gradient(45deg, #ff6f61, #ff8e53)'
            }}
          >
            {submittingRating ? "Submitting..." : "Submit Review"}
          </Button>
        </Paper>

        <Box className={styles.reviewsSection} sx={{ mt: 6, mb: 10 }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>Customer Reviews ({reviewLinksCount})</Typography>
          <div className={styles.carouselContainer}>
            {product.ratings && product.ratings.length > 0 ? (
              <>
                <div className={styles.carouselContent}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReviewIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper elevation={0} sx={{ p: 3, borderRadius: '15px', border: '1px solid #f0f0f0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                             <Avatar sx={{ bgcolor: '#ff6f61', mr: 2 }}>
                                {product.ratings[currentReviewIndex].userName ? product.ratings[currentReviewIndex].userName.charAt(0).toUpperCase() : <User size={20} />}
                             </Avatar>
                             <Box>
                                <Typography sx={{ fontWeight: 600 }}>{product.ratings[currentReviewIndex].userName || "Guest"}</Typography>
                                <Typography variant="caption" sx={{ color: '#999' }}>{new Date(product.ratings[currentReviewIndex].createdAt).toLocaleDateString()}</Typography>
                             </Box>
                          </Box>
                          <Rating value={product.ratings[currentReviewIndex].rating} readOnly size="small" />
                        </Box>
                        {product.ratings[currentReviewIndex].review && (
                          <Typography variant="body1">{product.ratings[currentReviewIndex].review}</Typography>
                        )}
                      </Paper>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {product.ratings.length > 1 && (
                  <Box className={styles.carouselActions} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3, gap: 2 }}>
                    <IconButton onClick={prevReview} sx={{ backgroundColor: 'white', border: '1px solid #f0f0f0' }}>
                      <ChevronLeft size={24} />
                    </IconButton>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                       {product.ratings.map((_, i) => (
                           <Box
                              key={i}
                              onClick={() => setCurrentReviewIndex(i)}
                              sx={{
                                 width: '10px',
                                 height: '10px',
                                 borderRadius: '50%',
                                 backgroundColor: currentReviewIndex === i ? '#ff6f61' : '#ddd',
                                 cursor: 'pointer'
                              }}
                           />
                       ))}
                    </Box>
                    <IconButton onClick={nextReview} sx={{ backgroundColor: 'white', border: '1px solid #f0f0f0' }}>
                      <ChevronRight size={24} />
                    </IconButton>
                  </Box>
                )}
              </>
            ) : (
              <Typography sx={{ textAlign: 'center', color: '#666', py: 5 }}>No reviews yet. Be the first to review!</Typography>
            )}
          </div>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default ProductDetails;
