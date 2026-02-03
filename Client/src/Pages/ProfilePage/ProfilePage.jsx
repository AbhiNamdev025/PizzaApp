import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  ShoppingBag,
  Heart,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BASE_URL } from "../../utils/constant";
import Header from "../../Components/Global/Header/Header";
import Footer from "../../Components/Global/Footer/Footer";
import styles from "./profilePage.module.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const res = await fetch(`${BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      toast.error("An error occurred while fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.profileContainer}>
          <div className={styles.container}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarSection}>
                <Skeleton circle width={80} height={80} />
                <div className={styles.headerInfo}>
                  <Skeleton width={200} height={32} />
                  <Skeleton
                    width={100}
                    height={20}
                    style={{ marginTop: "0.5rem" }}
                  />
                </div>
              </div>
              <Skeleton width={100} height={40} borderRadius={20} />
            </div>

            <div className={styles.profileGrid}>
              <div className={styles.infoCard}>
                <Skeleton
                  width={150}
                  height={24}
                  style={{ marginBottom: "1.5rem" }}
                />
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.infoItem}>
                    <Skeleton circle width={20} height={20} />
                    <div style={{ flex: 1, marginLeft: "1rem" }}>
                      <Skeleton width={80} height={12} />
                      <Skeleton
                        width="60%"
                        height={16}
                        style={{ marginTop: "0.4rem" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.quickLinks}>
                <Skeleton
                  width={150}
                  height={24}
                  style={{ marginBottom: "1.5rem" }}
                />
                <div className={styles.linksGrid}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height={100} borderRadius={16} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <User size={60} />
              </div>
              <div className={styles.headerInfo}>
                <h1>{user?.name}</h1>
                <p className={styles.roleBadge}>
                  <Shield size={14} /> {user?.role || "User"}
                </p>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div className={styles.profileGrid}>
            <div className={styles.infoCard}>
              <h3>Account Details</h3>
              <div className={styles.infoItem}>
                <User size={20} className={styles.infoIcon} />
                <div>
                  <label>Full Name</label>
                  <p>{user?.name}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Mail size={20} className={styles.infoIcon} />
                <div>
                  <label>Email Address</label>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Calendar size={20} className={styles.infoIcon} />
                <div>
                  <label>Joined On</label>
                  <p>
                    {(() => {
                      const dateSource =
                        user?.createdAt ||
                        (user?._id
                          ? new Date(
                              parseInt(user._id.substring(0, 8), 16) * 1000,
                            )
                          : null);

                      if (dateSource) {
                        const date = new Date(dateSource);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                        }
                      }
                      return "N/A";
                    })()}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.quickLinks}>
              <h3>Quick Actions</h3>
              <div className={styles.linksGrid}>
                <div
                  className={styles.linkCard}
                  onClick={() => navigate("/my-orders")}
                >
                  <ShoppingBag size={24} />
                  <span>My Orders</span>
                </div>
                <div
                  className={styles.linkCard}
                  onClick={() => navigate("/wishlist")}
                >
                  <Heart size={24} />
                  <span>Wishlist</span>
                </div>
                <div
                  className={styles.linkCard}
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingBag size={24} />
                  <span>View Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
