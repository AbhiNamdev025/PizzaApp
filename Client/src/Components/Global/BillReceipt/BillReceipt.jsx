import React, { useRef } from "react";
import styles from "./BillReceipt.module.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { X, Download, Printer } from "lucide-react";

function BillReceipt({ bill, onClose, isAdmin = false }) {
  const receiptRef = useRef(null);

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#fff0db",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a5");

      const componentWidth = receiptRef.current.offsetWidth;
      const componentHeight = receiptRef.current.offsetHeight;

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (componentHeight * pdfWidth) / componentWidth;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${bill.billId}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
    }
  };

  const handlePrint = () => {
    // Create a temporary iframe to print just the receipt content
    const printContent = receiptRef.current.innerHTML;

    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print Receipt</title>");
    // Copy styles for correct printing (simplified for print)
    printWindow.document.write(`
        <style>
          body { font-family: 'Courier New', monospace; padding: 20px; text-align: center; }
          .receipt { width: 100%; max-width: 350px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .header, .footer { text-align: center; }
          .title { font-size: 20px; font-weight: bold; margin: 10px 0; }
          .divider { border-top: 1px dashed #333; margin: 10px 0; }
          .meta, .itemRow, .summaryRow, .totalRow { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
          .totalRow { font-weight: bold; font-size: 16px; margin-top: 10px; border-top: 1px dashed #333; padding-top: 10px; }
          .itemInfo { text-align: left; }
          .itemPrice { text-align: right; }
          img { display: none; } 
          svg { width: 100%; height: auto; max-height: 50px; }
        </style>
      `);
    printWindow.document.write("</head><body>");
    printWindow.document.write('<div class="receipt">');
    printWindow.document.write(printContent);
    printWindow.document.write("</div>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      // printWindow.close(); // Optional
    }, 250);
  };

  return (
    <div className={styles.receiptOverlay}>
      <div className={styles.receiptContainer}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.receipt} ref={receiptRef}>
          <div className={styles.header}>
            <p>PIZZALIO </p>
            <p style={{ fontSize: "10px", marginTop: "4px" }}>Naraingarh</p>
            <p style={{ fontSize: "10px" }}>Tel: +91 98765 43210</p>
            <div className={styles.divider}></div>
            <h2 className={styles.title}>*** TAX INVOICE ***</h2>
            <div className={styles.divider}></div>
          </div>

          <div className={styles.meta}>
            <span>BILL ID: {bill.billId}</span>
            <span>{new Date(bill.generatedAt).toLocaleDateString()}</span>
          </div>
          <div className={styles.meta}>
            <span>
              TIME:{" "}
              {new Date(bill.generatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className={styles.meta}>
            <span>CUSTOMER: {bill.customerName}</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.items}>
            {bill.items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div className={styles.itemName}>
                  <div>{item.name}</div>
                  {(item.size || item.portion) && (
                    <div style={{ fontSize: "10px", color: "#666" }}>
                      {item.size
                        ? `Size: ${
                            { small: "S", medium: "M", large: "L" }[
                              item.size.toLowerCase()
                            ] || item.size
                          }`
                        : ""}
                      {item.size && item.portion ? " | " : ""}
                      {item.portion
                        ? `Portion: ${
                            item.portion.charAt(0).toUpperCase() +
                            item.portion.slice(1)
                          }`
                        : ""}
                    </div>
                  )}
                  <div style={{ fontSize: "9px", color: "#666" }}>
                    Qty: {item.quantity} x Rs. {item.price.toFixed(2)}
                  </div>
                </div>
                <span className={styles.itemPrice}>
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>SUBTOTAL</span>
              <span>Rs. {bill.subTotal?.toFixed(2)}</span>
            </div>
            {bill.deliveryCharge > 0 ? (
              <div className={styles.summaryRow}>
                <span>DELIVERY</span>
                <span>Rs. {bill.deliveryCharge.toFixed(2)}</span>
              </div>
            ) : (
              <div className={styles.summaryRow}>
                <span>DELIVERY</span>
                <span>FREE</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>TAX (GST)</span>
              <span>Rs. {bill.tax?.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>PAY MODE</span>
              <span>{bill.paymentMethod}</span>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalRow}>
            <span>START TOTAL</span>
            <span>Rs. {bill.grandTotal?.toFixed(2)}</span>
          </div>

          <div className={styles.divider}></div>
          <div className={styles.footer}>
            <p>THANK YOU FOR VISITING PIZZALIO!</p>

            <div className={styles.barcode}></div>
          </div>
        </div>

        <div className={styles.actions}>
          {isAdmin && (
            <button
              className={styles.actionBtn}
              onClick={handlePrint}
              title="Print Receipt"
            >
              <Printer size={18} /> Print
            </button>
          )}
          <button
            className={styles.actionBtn}
            onClick={handleDownload}
            title="Download PDF"
          >
            <Download size={18} /> Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillReceipt;
