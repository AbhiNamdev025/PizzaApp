const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-app-password",
    },
  });
};

const sendOrderNotificationToAdmin = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@pizzalio.com";

  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.name}${item.size ? ` (${item.size.charAt(0).toUpperCase()})` : ""}${item.portion ? ` (${item.portion})` : ""} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`,
    )
    .join("\n");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6f61 0%, #e53935 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .order-id { background: #fff3e0; padding: 15px; border-radius: 10px; text-align: center; margin-bottom: 25px; }
        .order-id strong { color: #e53935; font-size: 18px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #333; border-bottom: 2px solid #ff6f61; padding-bottom: 8px; margin-bottom: 15px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-label { color: #666; }
        .info-value { color: #333; font-weight: 600; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th { background: #f8f8f8; padding: 12px; text-align: left; color: #666; }
        .items-table td { padding: 12px; border-bottom: 1px solid #eee; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; color: white; margin-left: 5px; text-transform: uppercase; }
        .size-badge { background: #ff6f61; }
        .portion-badge { background: #4caf50; }
        .total-row { background: linear-gradient(135deg, #ff6f61 0%, #e53935 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-top: 20px; }
        .total-amount { font-size: 32px; font-weight: bold; }
        .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍕 New Order Received!</h1>
          <p>A new order has been placed on Pizzalio</p>
        </div>
        <div class="content">
          <div class="order-id">
            <strong>Order ID: ${order.orderId}</strong>
          </div>
          
          <div class="section">
            <h3>👤 Customer Details</h3>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${order.customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${order.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${order.email || "N/A"}</span>
            </div>
          </div>
          
          <div class="section">
            <h3>📍 Delivery Address</h3>
            <p style="color: #333; line-height: 1.6;">
              ${order.deliveryAddress}<br>
              ${order.city} - ${order.pincode}
            </p>
          </div>
          
          <div class="section">
            <h3>🛒 Order Items</h3>
            <table class="items-table">
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>
                    ${item.name}
                    ${item.size ? `<span class="badge size-badge">${item.size.charAt(0)}</span>` : ""}
                    ${item.portion ? `<span class="badge portion-badge">${item.portion}</span>` : ""}
                  </td>
                  <td>${item.quantity}</td>
                  <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </table>
          </div>
          
          <div class="section">
            <h3>💰 Payment Summary</h3>
            <div class="info-row">
              <span class="info-label">Items Total:</span>
              <span class="info-value">₹${order.itemsTotal.toFixed(2)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Delivery Charge:</span>
              <span class="info-value">₹${order.deliveryCharge.toFixed(2)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Packaging Charge (1%):</span>
              <span class="info-value">₹${order.tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="total-row">
            <div>Grand Total</div>
            <div class="total-amount">₹${order.grandTotal.toFixed(2)}</div>
          </div>
          
          ${
            order.specialInstructions
              ? `
          <div class="section" style="margin-top: 25px;">
            <h3>📝 Special Instructions</h3>
            <p style="color: #666; font-style: italic;">${order.specialInstructions}</p>
          </div>
          `
              : ""
          }
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Pizzalio. All rights reserved.</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Pizzalio Orders" <${process.env.EMAIL_USER || "orders@pizzalio.com"}>`,
    to: adminEmail,
    subject: `🍕 New Order #${order.orderId} - ₹${order.grandTotal.toFixed(2)}`,
    html: htmlContent,
    text: `
New Order Received!

Order ID: ${order.orderId}

Customer: ${order.customerName}
Phone: ${order.phone}
Email: ${order.email || "N/A"}

Delivery Address:
${order.deliveryAddress}
${order.city} - ${order.pincode}

Order Items:
${itemsList}

Items Total: ₹${order.itemsTotal.toFixed(2)}
Delivery Charge: ₹${order.deliveryCharge.toFixed(2)}
Packaging Charge (1%): ₹${order.tax.toFixed(2)}
Grand Total: ₹${order.grandTotal.toFixed(2)}

${order.specialInstructions ? `Special Instructions: ${order.specialInstructions}` : ""}
    `,
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  sendOrderNotificationToAdmin,
};
