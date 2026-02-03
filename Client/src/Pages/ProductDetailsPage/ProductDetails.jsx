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
        <div className={styles.container}>
          <div className={styles.productWrapper}>
            <div className={styles.imageSection}>
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
            </div>
            <div className={styles.infoSection}>
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
            </div>
          </div>
        </div>
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
      <div className={styles.container}>
        <motion.button
          className={styles.backBtn}
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        <div className={styles.productWrapper}>
          <motion.div
            className={styles.imageSection}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.imageContainer}>
              <motion.img
                src={allImages[activeImage] || product.image}
                alt={product.name}
                className={styles.productImage}
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.button
                className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`}
                onClick={() => setIsLiked(!isLiked)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={20} fill={isLiked ? "#e74c3c" : "none"} />
              </motion.button>
              {product.isPremium && (
                <div className={styles.premiumBadge}>
                  <Star size={14} fill="#333" /> Premium
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className={styles.thumbnails}>
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${activeImage === index ? styles.active : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img} alt={`View ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className={styles.imageSelectionArea}>
              {product.hasSizes && product.sizes && (
                <div className={styles.selectionSection}>
                  <h3 className={styles.selectionTitle}>Select Size</h3>
                  <div className={styles.sizeSelector}>
                    {["small", "medium", "large"].map(
                      (size) =>
                        product.sizes[size] > 0 && (
                          <button
                            key={size}
                            className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ""}`}
                            onClick={() => setSelectedSize(size)}
                          >
                            <span className={styles.sizeLabel}>
                              {size === "small"
                                ? "Small"
                                : size === "medium"
                                  ? "Medium"
                                  : "Large"}
                            </span>
                            <span className={styles.sizePrice}>
                              Rs. {product.sizes[size]}
                            </span>
                          </button>
                        ),
                    )}
                  </div>
                </div>
              )}

              {product.hasPortions && product.portions && (
                <div className={styles.selectionSection}>
                  <div className={styles.selectionTitle}>Select Portion</div>
                  <div className={styles.portionSelector}>
                    {["half", "full"].map(
                      (portion) =>
                        product.portions[portion] > 0 && (
                          <button
                            key={portion}
                            className={`${styles.portionBtn} ${selectedPortion === portion ? styles.portionActive : ""}`}
                            onClick={() => setSelectedPortion(portion)}
                          >
                            <span className={styles.portionLabel}>
                              {portion === "half" ? "Half" : "Full"}
                            </span>
                            <span className={styles.portionPrice}>
                              Rs. {product.portions[portion]}
                            </span>
                          </button>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className={styles.infoSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className={styles.productName}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={
                      star <= Math.round(totalRating)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                    fill={star <= Math.round(totalRating) ? "#ffc107" : "none"}
                  />
                ))}
              </div>
              <span className={styles.ratingValue}>
                {totalRating > 0 ? totalRating : "No ratings"}
              </span>
              <span className={styles.reviewCount}>
                {reviewLinksCount} reviews
              </span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <Clock size={16} />
                <span>20-30 mins delivery</span>
              </div>
              <div className={styles.metaItem}>
                <Truck size={16} />
                <span>Free delivery over Rs. 500</span>
              </div>
              <div className={styles.metaItem}>
                <Shield size={16} />
                <span>Quality guaranteed</span>
              </div>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.price}>Rs. {currentPrice}</span>
              {discountAmount > 0 && (
                <>
                  <span className={styles.originalPrice}>Rs. {basePrice}</span>
                  <span className={styles.discount}>{discountAmount}% OFF</span>
                </>
              )}
            </div>

            <div className={styles.quantitySection}>
              <span>Quantity:</span>
              <div className={styles.quantityControls}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange("decrease")}
                  className={styles.qtyBtn}
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </motion.button>
                <span className={styles.qtyValue}>{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange("increase")}
                  className={styles.qtyBtn}
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </div>

            <div className={styles.totalPrice}>
              <span>Total:</span>
              <span className={styles.totalAmount}>
                Rs. {currentPrice * quantity}
              </span>
            </div>

            <motion.button
              className={styles.addToCartBtn}
              onClick={addToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart size={20} /> Add to Cart
            </motion.button>

            <div className={styles.features}>
              <div className={styles.feature}>
                <Clock size={24} />
                <p>Fresh & Hot</p>
              </div>
              <div className={styles.feature}>
                <Truck size={24} />
                <p>Fast Delivery</p>
              </div>
              <div className={styles.feature}>
                <Shield size={24} />
                <p>Best Quality</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.addReviewSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2>Rate this Product</h2>
          <div className={styles.ratingInput}>
            <div className={styles.starInput}>
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  className={styles.starBtn}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(star)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Star
                    size={32}
                    fill={
                      (hoverRating || userRating) >= star ? "#ffc107" : "none"
                    }
                    stroke={
                      (hoverRating || userRating) >= star ? "#ffc107" : "#ddd"
                    }
                  />
                </motion.button>
              ))}
            </div>
            <span className={styles.selectedRating}>
              {userRating > 0
                ? `${userRating} Star${userRating > 1 ? "s" : ""}`
                : "Select rating"}
            </span>
          </div>
          <textarea
            className={styles.reviewInput}
            placeholder="Write your review (optional)..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
          />
          <motion.button
            className={styles.submitReviewBtn}
            onClick={submitRating}
            disabled={submittingRating || !userRating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send size={18} />
            {submittingRating ? "Submitting..." : "Submit Review"}
          </motion.button>
        </motion.div>

        <motion.div
          className={styles.reviewsSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2>Customer Reviews ({reviewLinksCount})</h2>
          <div className={styles.carouselContainer}>
            {product.ratings && product.ratings.length > 0 ? (
              <>
                <div className={styles.carouselContent}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReviewIndex}
                      className={styles.reviewCard}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerInfo}>
                          <div className={styles.avatar}>
                            {product.ratings[currentReviewIndex].userName ? (
                              product.ratings[currentReviewIndex].userName
                                .charAt(0)
                                .toUpperCase()
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div>
                            <span className={styles.reviewerName}>
                              {product.ratings[currentReviewIndex].userName ||
                                product.ratings[currentReviewIndex].userId
                                  ?.name ||
                                "Guest User"}
                            </span>
                            <span className={styles.reviewDate}>
                              {new Date(
                                product.ratings[currentReviewIndex].createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className={styles.reviewStars}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={
                                i < product.ratings[currentReviewIndex].rating
                                  ? "#ffc107"
                                  : "none"
                              }
                              stroke={
                                i < product.ratings[currentReviewIndex].rating
                                  ? "#ffc107"
                                  : "#ddd"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {product.ratings[currentReviewIndex].review && (
                        <p className={styles.reviewText}>
                          {product.ratings[currentReviewIndex].review}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {product.ratings.length > 1 && (
                  <div className={styles.carouselActions}>
                    <button className={styles.carouselBtn} onClick={prevReview}>
                      <ChevronLeft size={24} />
                    </button>
                    <div className={styles.carouselDots}>
                      {product.ratings.map((_, i) => (
                        <div
                          key={i}
                          className={`${styles.dot} ${currentReviewIndex === i ? styles.activeDot : ""}`}
                          onClick={() => setCurrentReviewIndex(i)}
                        />
                      ))}
                    </div>
                    <button className={styles.carouselBtn} onClick={nextReview}>
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className={styles.noReviews}>
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
