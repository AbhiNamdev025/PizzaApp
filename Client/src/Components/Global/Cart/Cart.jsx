import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Pizza,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import {
  Button,
  IconButton,
  Typography,
  Box,
  Paper,
  Divider,
  Container,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
} from "@mui/material";
import styles from "./cart.module.css";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BASE_URL } from "../../../utils/constant";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your cart");
        setCartItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/cart/find`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/cart/del/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCartItems();
        toast.success("Item Removed From Cart");
        window.dispatchEvent(new Event("cartUpdate"));
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });

      if (res.ok) {
        setCartItems((items) =>
          items.map((item) =>
            item._id === cartItemId ? { ...item, quantity: newQuantity } : item,
          ),
        );
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      toast.error("Error updating quantity");
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  if (loading) {
    return (
      <>
        <Header />
        <Box className={styles.cartContainer}>
          <Box className={styles.container}>
            <Skeleton
              height={50}
              width={300}
              style={{ marginBottom: "1rem" }}
            />
            <Skeleton
              height={20}
              width={150}
              style={{ marginBottom: "2.5rem" }}
            />

            <Box className={styles.cartContent}>
              <Box className={styles.cartItems}>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    className={styles.cartItem}
                    style={{ border: "none" }}
                  >
                    <Skeleton width={120} height={120} borderRadius={20} />
                    <Box
                      className={styles.itemDetails}
                      style={{ padding: "0 1.5rem" }}
                    >
                      <Skeleton width="40%" height={24} />
                      <Skeleton
                        width="90%"
                        height={16}
                        style={{ marginTop: "1rem" }}
                      />
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "1.5rem",
                        }}
                      >
                        <Skeleton width={80} height={24} />
                        <Skeleton width={100} height={36} borderRadius={20} />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box
                className={styles.cartSummary}
                style={{ height: "fit-content" }}
              >
                <Skeleton
                  height={26}
                  width="60%"
                  style={{ marginBottom: "2rem" }}
                />
                <Skeleton
                  height={20}
                  width="100%"
                  count={2}
                  style={{ marginBottom: "1.2rem" }}
                />
                <Skeleton
                  height={55}
                  width="100%"
                  borderRadius={15}
                  style={{ marginTop: "1.5rem" }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Footer />
      </>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Header />
        <Box className={styles.cartContainer}>
          <Box className={styles.emptyCart} sx={{ textAlign: 'center', py: 10 }}>
            <ShoppingBag size={80} color="#ddd" strokeWidth={1} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>Your Cart is Empty</Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>Add some delicious pizzas to get started!</Typography>
            <Button
              variant="contained"
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/home")}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Box className={styles.cartContainer}>
        <Box className={styles.container}>
          <Typography variant="h3" className={styles.cartTitle} sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 800 }}>
            <ShoppingCart size={32} color="#ff6f61" /> Your Pizza Cart
          </Typography>
          <Typography variant="body1" className={styles.cartSubtitle} sx={{ color: '#666', mb: 4 }}>
            {cartItems.length} item(s) in your cart
          </Typography>

          <Box className={styles.cartContent}>
            <Box className={styles.cartItems}>
              {cartItems.map((item) => (
                <Paper key={item._id} elevation={0} className={styles.cartItem} sx={{ p: 2, mb: 2, borderRadius: '20px', border: '1px solid #f0f0f0', display: 'flex', position: 'relative' }}>
                  <Box sx={{ width: 120, height: 120, borderRadius: '15px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>

                  <Box sx={{ flex: 1, px: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                      {item.size && (
                        <Box sx={{ backgroundColor: '#fff5f4', color: '#ff6f61', px: 1, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {item.size.charAt(0).toUpperCase()}
                        </Box>
                      )}
                      {item.portion && (
                        <Box sx={{ backgroundColor: '#fff5f4', color: '#ff6f61', px: 1, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {item.portion}
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Rs. {item.price}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #f0f0f0', borderRadius: '50px', p: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          sx={{ backgroundColor: '#f5f5f5' }}
                        >
                          <Minus size={14} />
                        </IconButton>
                        <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          sx={{ backgroundColor: '#f5f5f5' }}
                        >
                          <Plus size={14} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  <Tooltip title="Remove item">
                    <IconButton
                      onClick={() => removeFromCart(item._id)}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        color: '#ddd',
                        '&:hover': { color: '#ff4757', backgroundColor: 'rgba(255, 71, 87, 0.1)' }
                      }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </Tooltip>
                </Paper>
              ))}
            </Box>

            <Paper elevation={0} className={styles.cartSummary} sx={{ p: 4, borderRadius: '25px', border: '1px solid #f0f0f0', alignSelf: 'flex-start', position: 'sticky', top: '100px' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Order Summary</Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="textSecondary">Total Items</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{cartItems.length}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>Rs. {subtotal.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<CreditCard size={20} />}
                onClick={() => navigate("/order")}
                sx={{
                  height: '55px',
                  borderRadius: '15px',
                  mb: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
                  boxShadow: '0 8px 20px rgba(255,111,97,0.3)',
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowLeft size={18} />}
                onClick={() => navigate("/home")}
                sx={{
                  height: '50px',
                  borderRadius: '15px',
                  textTransform: 'none',
                  color: '#666',
                  borderColor: '#f0f0f0',
                  '&:hover': { borderColor: '#ff6f61', backgroundColor: 'rgba(255,111,97,0.05)' }
                }}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default CartPage;
