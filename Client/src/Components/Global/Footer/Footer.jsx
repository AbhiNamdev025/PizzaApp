import React from "react";
import styles from "./Footer.module.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPizzaSlice,
  FaTruck,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.brandSection}>
            <div className={styles.footerLogo}>
              <FaPizzaSlice className={styles.logoIcon} />
              <span className={styles.brandName}>PIZZAIOLO</span>
            </div>
            <p className={styles.brandDescription}>
              Authentic Italian pizzas crafted with passion and tradition.
              Experience the taste of Italy delivered fresh to your doorstep.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          <div className={styles.contactSection}>
            <h3 className={styles.sectionTitle}>Contact Info</h3>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <div>
                <span className={styles.contactLabel}>Address:</span>
                <p className={styles.contactText}>
                  Main Market, Channa Colony
                  <br />
                  Naraingarh , 134203
                </p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaPhoneAlt className={styles.contactIcon} />
              <div>
                <span className={styles.contactLabel}>Phone:</span>
                <p className={styles.contactText}>+91 9812409496</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <div>
                <span className={styles.contactLabel}>Email:</span>
                <p className={styles.contactText}>namdevabhi025@gmail.com</p>
              </div>
            </div>
          </div>

          <div className={styles.hoursSection}>
            <h3 className={styles.sectionTitle}>Opening Hours</h3>
            <div className={styles.hoursItem}>
              <FaClock className={styles.hoursIcon} />
              <div className={styles.hoursInfo}>
                <span className={styles.hoursDays}>Monday - Friday</span>
                <span className={styles.hoursTime}>10:00 AM - 11:00 PM</span>
              </div>
            </div>
            <div className={styles.hoursItem}>
              <FaClock className={styles.hoursIcon} />
              <div className={styles.hoursInfo}>
                <span className={styles.hoursDays}>Saturday - Sunday</span>
                <span className={styles.hoursTime}>11:00 AM - 12:00 AM</span>
              </div>
            </div>
            <div className={styles.deliveryInfo}>
              <p>
                <FaTruck className={styles.deliveryIcon} /> Free delivery on
                orders above ₹299
              </p>
              <p>
                <FaClock className={styles.deliveryIcon} /> 30-minute delivery
                guarantee
              </p>
            </div>
          </div>

          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>
                <a href="/home" className={styles.footerLink}>
                  Home
                </a>
              </li>

              <li>
                <a href="/about" className={styles.footerLink}>
                  About Us
                </a>
              </li>

              <li>
                <a href="/product" className={styles.footerLink}>
                  Our Products
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyrightSection}>
          <div className={styles.copyrightContent}>
            <p className={styles.copyrightText}>
              © 2025 Pizzaiolo - Authentic Italian Pizza. All rights reserved.
            </p>
            <p className={styles.madeIn}>Made in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
