import { useNavigate } from "react-router-dom";
import styles from "./orderform.module.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Truck,
} from "lucide-react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Container,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BASE_URL } from "../../../utils/constant";

function OrderForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    city: "",
    pincode: "",
    paymentMethod: "UPI",
    specialInstructions: "",
  });

  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your cart");
        setOrderItems([]);
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
        setOrderItems(data || []);
      } else {
        setOrderItems([]);
        toast.error("Failed to load cart items");
      }
    } catch (error) {
      setOrderItems([]);
      toast.error("Error loading cart items");
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderTotal = () => {
    const itemsTotal = orderItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0,
    );

    const isFreeDelivery = itemsTotal > 300;
    const deliveryCharge = isFreeDelivery ? 0 : 40;

    const packagingCharge = (itemsTotal * 0.01).toFixed(2);
    const grandTotal =
      itemsTotal + deliveryCharge + parseFloat(packagingCharge);

    return {
      itemsTotal: itemsTotal.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      packagingCharge: packagingCharge,
      grandTotal: grandTotal.toFixed(2),
      isFreeDelivery: isFreeDelivery,
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.customerName ||
      !formData.phone ||
      !formData.deliveryAddress ||
      !formData.city ||
      !formData.pincode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const totals = calculateOrderTotal();

    const orderData = {
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      deliveryAddress: formData.deliveryAddress,
      city: formData.city,
      pincode: formData.pincode,
      specialInstructions: formData.specialInstructions,
      items: orderItems.map((item) => ({
        productId: item.productId || item._id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image,
        size: item.size || null,
        portion: item.portion || null,
      })),
      itemsTotal: totals.itemsTotal,
      deliveryCharge: totals.deliveryCharge,
      tax: totals.packagingCharge,
      grandTotal: totals.grandTotal,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/confirmation", {
          state: {
            orderData: {
              orderId: data.order.orderId,
              customerInfo: formData,
              items: orderItems,
              orderDate: new Date().toLocaleDateString(),
              orderTime: new Date().toLocaleTimeString(),
              totals: totals,
              status: "Confirmed",
              paymentMethod: "Cash on Delivery",
            },
          },
        });

        toast.success("Order placed successfully!");
        window.dispatchEvent(new Event("cartUpdate"));
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box className={styles.orderContainer}>
        <Container maxWidth="xl" className={styles.container}>
          <Skeleton height={40} width={250} style={{ marginBottom: "1rem" }} />
          <Skeleton
            height={20}
            width={150}
            style={{ marginBottom: "2.5rem" }}
          />

          <Box className={styles.orderContent}>
            <Box className={styles.orderSummary}>
              <Skeleton
                height={28}
                width="50%"
                style={{ marginBottom: "2rem" }}
              />
              <Box className={styles.orderItems}>
                {[1, 2].map((i) => (
                  <Box
                    key={i}
                    className={styles.orderItem}
                    style={{ border: "none" }}
                  >
                    <Skeleton width={80} height={80} borderRadius={15} />
                    <Box style={{ flex: 1, marginLeft: "1.5rem" }}>
                      <Skeleton width="60%" height={20} />
                      <Skeleton
                        width="40%"
                        height={14}
                        style={{ marginTop: "0.8rem" }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box className={styles.checkoutForm}>
              <Skeleton
                height={30}
                width="60%"
                style={{ marginBottom: "2rem" }}
              />
              {[1, 2, 3].map((i) => (
                <Box key={i} style={{ marginBottom: "1.5rem" }}>
                  <Skeleton
                    width={100}
                    height={16}
                    style={{ marginBottom: "0.8rem" }}
                  />
                  <Skeleton height={45} borderRadius={10} />
                </Box>
              ))}
              <Skeleton
                height={60}
                borderRadius={12}
                style={{ marginTop: "2rem" }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return (
      <Box className={styles.orderContainer}>
        <Box className={styles.emptyCart} sx={{ textAlign: 'center', py: 10 }}>
          <ShoppingBag size={80} color="#ddd" strokeWidth={1} />
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>Your Cart is Empty</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>Add some delicious pizzas to place an order!</Typography>
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
    );
  }

  const totals = calculateOrderTotal();

  return (
    <Box className={styles.orderContainer}>
      <Container maxWidth="xl" className={styles.container}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Checkout</Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          {orderItems.length} item(s) in your order
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 4, 
          mt: 4,
          alignItems: 'flex-start'
        }}>
          {/* LEFT SIDE: Order Summary */}
          <Box sx={{ 
            width: { xs: '100%', md: '350px', lg: '400px' },
            flexShrink: 0,
            position: { md: 'sticky' },
            top: { md: '100px' }
          }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '25px', border: '1px solid #f0f0f0', bgcolor: 'white' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#333' }}>Order Summary</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {orderItems.map((item) => (
                  <Box key={item._id} sx={{ display: 'flex', gap: 2, pb: 2, borderBottom: '1px solid #f9f9f9' }}>
                    <Box sx={{ width: 60, height: 60, borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{item.name}</Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                        Qty: {item.quantity} × Rs. {item.price}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ff6f61' }}>
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: '#fffaf0', borderRadius: '15px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                   <Typography variant="body2" color="textSecondary">Subtotal</Typography>
                   <Typography variant="body2" sx={{ fontWeight: 600 }}>Rs. {totals.itemsTotal}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                   <Typography variant="body2" color="textSecondary">Delivery</Typography>
                   <Typography variant="body2" sx={{ fontWeight: 600, color: totals.isFreeDelivery ? '#4caf50' : 'inherit' }}>
                     {totals.isFreeDelivery ? 'FREE' : `Rs. ${totals.deliveryCharge}`}
                   </Typography>
                </Box>
                <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                   <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
                   <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ff6f61' }}>Rs. {totals.grandTotal}</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* RIGHT SIDE: Delivery Info Form */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '25px', border: '1px solid #f0f0f0', bgcolor: 'white' }}>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MapPin size={24} color="#ff6f61" /> Delivery Information
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3, // Spacing between fields
                  '& > *': { 
                    width: { xs: '100%', md: 'calc(50% - 12px)' } // Force two per row on desktop
                  } 
                }}>
                  <TextField
                    label="Full Name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={18} color="#ccc" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <TextField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone size={18} color="#ccc" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={18} color="#ccc" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <TextField
                     label="City"
                     name="city"
                     value={formData.city}
                     onChange={handleInputChange}
                     required
                     variant="outlined"
                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <TextField
                     label="Pincode"
                     name="pincode"
                     value={formData.pincode}
                     onChange={handleInputChange}
                     required
                     variant="outlined"
                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                     <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCard size={18} color="#ff6f61" /> Payment Method
                     </Typography>
                     <Box sx={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: '50px', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #eee' }}>
                        <Truck size={16} /> Cash on Delivery
                     </Box>
                  </Box>

                  <TextField
                    fullWidth
                    label="Delivery Address"
                    name="deliveryAddress"
                    multiline
                    rows={2}
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ width: '100% !important', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <TextField
                    fullWidth
                    label="Special Instructions"
                    name="specialInstructions"
                    multiline
                    rows={2}
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery..."
                    variant="outlined"
                    sx={{ width: '100% !important', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Box>

                <Box sx={{ mt: 5, p: 3, bgcolor: '#fafafa', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Order Total</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                     <Typography color="textSecondary">Items ({orderItems.length})</Typography>
                     <Typography sx={{ fontWeight: 600 }}>Rs. {totals.itemsTotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                     <Typography color="textSecondary">
                       Delivery {totals.isFreeDelivery && <span style={{ color: '#2ecc71', fontWeight: 800, marginLeft: 8 }}>FREE</span>}
                     </Typography>
                     <Typography sx={{ fontWeight: 600, color: totals.isFreeDelivery ? '#aaa' : 'black', textDecoration: totals.isFreeDelivery ? 'line-through' : 'none' }}>
                        Rs. 40
                     </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                     <Typography color="textSecondary">Packaging (1%)</Typography>
                     <Typography sx={{ fontWeight: 600 }}>Rs. {totals.packagingCharge}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Typography variant="h5" sx={{ fontWeight: 800 }}>Total</Typography>
                     <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>Rs. {totals.grandTotal}</Typography>
                  </Box>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircle size={24} />}
                  sx={{
                    mt: 4,
                    height: '65px',
                    borderRadius: '18px',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
                    boxShadow: '0 10px 25px rgba(255,111,97,0.3)',
                  }}
                >
                   Place Order - Rs. {totals.grandTotal}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  startIcon={<ArrowLeft size={18} />}
                  onClick={() => navigate("/cart")}
                  sx={{ mt: 2, color: '#666', fontWeight: 600, textTransform: 'none' }}
                >
                  Back to Cart
                </Button>
              </form>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default OrderForm;
