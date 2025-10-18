// import { useNavigate } from "react-router-dom";
// import styles from "./orderform.module.css";
// import React, { useEffect, useState } from "react";

// function OrderForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     customerName: "",
//     phone: "",
//     email: "",
//     deliveryAddress: "",
//     city: "",
//     pincode: "",
//     paymentMethod: "UPI",
//     specialInstructions: "",
//   });

//   const [orderItems, setOrderItems] = useState([]);

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const fetchCartItems = async () => {
//     try {
//       const res = await fetch("http://localhost:3535/cart/find");
//       const data = await res.json();
//       setOrderItems(data);
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//       setOrderItems([]);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Order submitted:", formData);
//     alert("Order placed successfully!");
//     navigate("/confirmation");
//   };

//   return (
//     <div className={styles.orderContainer}>
//       <div className={styles.container}>
//         <h1 className={styles.orderTitle}>Checkout</h1>
//         <p className={styles.orderSubtitle}>Complete your order details</p>

//         <div className={styles.orderContent}>
//           <div className={styles.orderSummary}>
//             <h3>Order Summary</h3>
//             {orderItems.map((item) => (
//               <div key={item.id} className={styles.orderItem}>
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className={styles.itemImage}
//                 />
//                 <div className={styles.itemDetails}>
//                   <h4 className={styles.itemName}>{item.name}</h4>
//                   <span className={styles.itemPrice}>
//                     Rs. {item.price} × {item.quantity}
//                   </span>
//                 </div>
//                 <div className={styles.itemTotal}>
//                   Rs. {item.price * item.quantity}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className={styles.checkoutForm}>
//             <form onSubmit={handleSubmit}>
//               <h3>Delivery Information</h3>

//               <div className={styles.formGroup}>
//                 <label>Full Name *</label>
//                 <input
//                   type="text"
//                   name="customerName"
//                   value={formData.customerName}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter your full name"
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Phone Number *</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter your phone number"
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Delivery Address *</label>
//                 <textarea
//                   name="deliveryAddress"
//                   value={formData.deliveryAddress}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter complete delivery address"
//                   rows="3"
//                 />
//               </div>

//               <div className={styles.formRow}>
//                 <div className={styles.formGroup}>
//                   <label>City *</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="City"
//                   />
//                 </div>
//                 <div className={styles.formGroup}>
//                   <label>Pincode *</label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Pincode"
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Payment Method *</label>
//                 <select
//                   name="paymentMethod"
//                   value={formData.paymentMethod}
//                   onChange={handleInputChange}
//                 >
//                   <option value="credit-card">Credit Card</option>
//                   <option value="debit-card">Debit Card</option>
//                   <option value="upi">UPI</option>
//                   <option value="cash">Cash on Delivery</option>
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Special Instructions</label>
//                 <textarea
//                   name="specialInstructions"
//                   value={formData.specialInstructions}
//                   onChange={handleInputChange}
//                   placeholder="Any special instructions for delivery..."
//                   rows="2"
//                 />
//               </div>

//               <div className={styles.orderTotal}>
//                 <h4>Order Total</h4>
//                 <div className={styles.totalRow}>
//                   <span>Items</span>
//                   <span>Rs. </span>
//                 </div>
//                 <div className={styles.totalRow}>
//                   <span>Delivery:</span>
//                   <span>Rs. </span>
//                 </div>
//                 <div className={styles.totalRow}>
//                   <span>Tax (5%):</span>
//                   <span>Rs. </span>
//                 </div>
//                 <div className={styles.grandTotal}>
//                   <span>Total:</span>
//                   <span>Rs. </span>
//                 </div>
//               </div>

//               <button type="submit" className={styles.placeOrderBtn}>
//                 Place Order - Rs.
//               </button>

//               <button
//                 type="button"
//                 className={styles.backButton}
//                 onClick={() => navigate("/cart")}
//               >
//                 Back to Cart
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderForm;

import { useNavigate } from "react-router-dom";
import styles from "./orderform.module.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

      const res = await fetch("http://localhost:3535/cart/find", {
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
        console.error("Failed to fetch cart items");
        setOrderItems([]);
        toast.error("Failed to load cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setOrderItems([]);
      toast.error("Error loading cart items");
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderTotal = () => {
    const itemsTotal = orderItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
    const deliveryCharge = itemsTotal > 0 ? 40 : 0; // Rs. 40 delivery charge
    const tax = (itemsTotal * 0.05).toFixed(2); // 5% tax
    const grandTotal = itemsTotal + deliveryCharge + parseFloat(tax);

    return {
      itemsTotal: itemsTotal.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      tax: tax,
      grandTotal: grandTotal.toFixed(2),
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
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
      orderId: `ORD-${Date.now()}`,
      customerInfo: formData,
      items: orderItems,
      orderDate: new Date().toLocaleDateString(),
      orderTime: new Date().toLocaleTimeString(),
      totals: totals,
      status: "Confirmed",
    };

    // Navigate to confirmation page with order data
    navigate("/confirmation", {
      state: {
        orderData: orderData,
      },
    });

    toast.success("Order placed successfully!");
  };

  if (loading) {
    return (
      <div className={styles.orderContainer}>
        <div className={styles.loading}>
          <h2>Loading your order...</h2>
        </div>
      </div>
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className={styles.orderContainer}>
        <div className={styles.emptyCart}>
          <h2>Your Cart is Empty</h2>
          <p>Add some delicious pizzas to place an order!</p>
          <button
            className={styles.continueShopping}
            onClick={() => navigate("/home")}
          >
            Continue Shopping
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
                    <h4 className={styles.itemName}>{item.name}</h4>
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
              <h3>Delivery Information</h3>

              <div className={styles.formGroup}>
                <label>Full Name *</label>
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
                <label>Phone Number *</label>
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
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Delivery Address *</label>
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
                <label>Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="cash">Cash on Delivery</option>
                </select>
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
                  <span>Delivery:</span>
                  <span>Rs. {totals.deliveryCharge}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Tax (5%):</span>
                  <span>Rs. {totals.tax}</span>
                </div>
                <div className={styles.grandTotal}>
                  <span>Total:</span>
                  <span>Rs. {totals.grandTotal}</span>
                </div>
              </div>

              <button type="submit" className={styles.placeOrderBtn}>
                Place Order - Rs. {totals.grandTotal}
              </button>

              <button
                type="button"
                className={styles.backButton}
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
