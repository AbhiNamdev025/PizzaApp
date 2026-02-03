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
      <div className={styles.orderContainer}>
        <div className={styles.container}>
          <Skeleton height={40} width={250} style={{ marginBottom: "1rem" }} />
          <Skeleton
            height={20}
            width={150}
            style={{ marginBottom: "2.5rem" }}
          />

          <div className={styles.orderContent}>
            <div className={styles.orderSummary}>
              <Skeleton
                height={28}
                width="50%"
                style={{ marginBottom: "2rem" }}
              />
              <div className={styles.orderItems}>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={styles.orderItem}
                    style={{ border: "none" }}
                  >
                    <Skeleton width={80} height={80} borderRadius={15} />
                    <div style={{ flex: 1, marginLeft: "1.5rem" }}>
                      <Skeleton width="60%" height={20} />
                      <Skeleton
                        width="40%"
                        height={14}
                        style={{ marginTop: "0.8rem" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.checkoutForm}>
              <Skeleton
                height={30}
                width="60%"
                style={{ marginBottom: "2rem" }}
              />
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ marginBottom: "1.5rem" }}>
                  <Skeleton
                    width={100}
                    height={16}
                    style={{ marginBottom: "0.8rem" }}
                  />
                  <Skeleton height={45} borderRadius={10} />
                </div>
              ))}
              <Skeleton
                height={60}
                borderRadius={12}
                style={{ marginTop: "2rem" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className={styles.orderContainer}>
        <div className={styles.emptyCart}>
          <ShoppingBag size={80} color="#ddd" strokeWidth={1} />
          <h2>Your Cart is Empty</h2>
          <p>Add some delicious pizzas to place an order!</p>
          <button
            className={styles.continueShopping}
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateOrderTotal();

  return (
    <div className={styles.orderContainer}>
      <div className={styles.container}>
        <h1 className={styles.orderTitle}>Checkout</h1>
        <p className={styles.orderSubtitle}>
          {orderItems.length} item(s) in your order
        </p>

        <div className={styles.orderContent}>
          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <div className={styles.orderItems}>
              {orderItems.map((item) => (
                <div key={item._id} className={styles.orderItem}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>
                      {item.name}
                      {item.size && (
                        <span className={styles.sizeBadge}>
                          {item.size.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {item.portion && (
                        <span className={styles.portionBadge}>
                          {item.portion}
                        </span>
                      )}
                    </h4>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemPrice}>Rs. {item.price}</span>
                      <span className={styles.quantity}>
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.checkoutForm}>
            <form onSubmit={handleSubmit}>
              <h3 className={styles.sectionHeader}>
                <MapPin size={20} /> Delivery Information
              </h3>

              <div className={styles.formGroup}>
                <label>
                  <User size={16} /> Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Phone size={16} /> Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <MapPin size={16} /> Delivery Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter complete delivery address"
                  rows="3"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>
                  <CreditCard size={16} /> Payment Method
                </label>
                <div className={styles.codBadge}>
                  <Truck size={16} /> Cash on Delivery
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for delivery..."
                  rows="2"
                />
              </div>

              <div className={styles.orderTotal}>
                <h4>Order Total</h4>
                <div className={styles.totalRow}>
                  <span>Items ({orderItems.length})</span>
                  <span>Rs. {totals.itemsTotal}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>
                    Delivery{" "}
                    {totals.isFreeDelivery && (
                      <span className={styles.freeBadge}>FREE</span>
                    )}
                  </span>
                  <span
                    style={
                      totals.isFreeDelivery
                        ? { textDecoration: "line-through", color: "#999" }
                        : {}
                    }
                  >
                    {totals.isFreeDelivery
                      ? "Rs. 40"
                      : `Rs. ${totals.deliveryCharge}`}
                  </span>
                </div>
                <div className={styles.totalRow}>
                  <span>Packaging (1%)</span>
                  <span>Rs. {totals.packagingCharge}</span>
                </div>
                <div className={styles.grandTotal}>
                  <span>Total:</span>
                  <span>Rs. {totals.grandTotal}</span>
                </div>
              </div>

              <button type="submit" className={styles.placeOrderBtn}>
                <CheckCircle size={20} /> Place Order - Rs. {totals.grandTotal}
              </button>

              <button
                type="button"
                className={styles.backButton}
                onClick={() => navigate("/cart")}
              >
                <ArrowLeft size={18} /> Back to Cart
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
