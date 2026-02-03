import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowLeft, Pizza } from "lucide-react";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../utils/constant";
import Header from "../../Components/Global/Header/Header";
import Footer from "../../Components/Global/Footer/Footer";
import PizzaCard from "../../Components/Global/Cards/PizzaCard/pizzaCard";
import PizzaSkeleton from "../../Components/Global/Cards/PizzaCard/PizzaSkeleton";
import styles from "./wishlistPage.module.css";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view wishlist");
        navigate("/");
        return;
      }

      const res = await fetch(`${BASE_URL}/wishlist/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data);
      } else {
        toast.error("Failed to fetch wishlist");
      }
    } catch (error) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, pizza) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        toast.success(`${pizza.name} added to cart!`);
        // Notify Header to update cart count
        window.dispatchEvent(new Event("cartUpdate"));
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // No longer returning solid loading page, grid handles it

  const displayContent = () => {
    if (loading) {
      return (
        <div className={styles.pizzaGrid}>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <PizzaSkeleton key={i} />
            ))}
        </div>
      );
    }

    if (wishlistItems.length === 0) {
      return (
        <div className={styles.emptyWishlist}>
          <Pizza size={80} color="#ddd" />
          <h2>Your wishlist is empty</h2>
          <p>Explore our menu and save your favorite pizzas!</p>
          <button className={styles.shopBtn} onClick={() => navigate("/home")}>
            Browse Menu
          </button>
        </div>
      );
    }

    return (
      <div className={styles.pizzaGrid}>
        {wishlistItems.map((pizza) => (
          <PizzaCard
            key={pizza._id}
            pizza={pizza}
            addToCart={() => addToCart(pizza._id, pizza)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.wishlistContainer}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back
            </button>
            <h1 className={styles.title}>
              <Heart size={32} className={styles.heartIcon} fill="#ff4757" /> My
              Wishlist
            </h1>
            <p className={styles.subtitle}>
              {wishlistItems.length} items saved for later
            </p>
          </div>

          {displayContent()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
