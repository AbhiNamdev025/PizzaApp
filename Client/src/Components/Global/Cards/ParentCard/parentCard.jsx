import React, { useState, useEffect } from "react";
import PizzaCard from "../PizzaCard/pizzaCard";
import styles from "./parentCard.module.css";
import { toast } from "react-hot-toast";
import {
  Pizza,
  Search,
  X,
  LayoutGrid,
  Zap,
  Coffee,
  IceCream,
  Utensils,
  Layers,
  Soup,
  Leaf,
  Drumstick,
  ArrowUpDown,
  TrendingUp,
} from "lucide-react";
import PizzaSkeleton from "../PizzaCard/PizzaSkeleton";
import CustomSelect from "../../../Global/CustomSelect/CustomSelect";
import { BASE_URL } from "../../../../utils/constant";

const CATEGORY_ICONS = {
  All: <LayoutGrid size={16} />,
  "Fast Food": <Zap size={16} />,
  "Junk Food": <Utensils size={16} />,
  Drinks: <Coffee size={16} />,
  Desserts: <IceCream size={16} />,
  Snacks: <Soup size={16} />,
  Combos: <Layers size={16} />,
  "Main Course": <Pizza size={16} />,
};

const CATEGORIES_LIST = [
  "All",
  "Fast Food",
  "Junk Food",
  "Drinks",
  "Desserts",
  "Snacks",
  "Combos",
  "Main Course",
].map((cat) => ({
  label: cat,
  value: cat,
  icon: CATEGORY_ICONS[cat] || <Pizza size={16} />,
}));

const ParentCard = ({ showFilters = false, limit = null }) => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dietFilter, setDietFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/product/find`);
      const data = await response.json();
      setPizzas(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getFilteredAndSortedPizzas = () => {
    let filtered = [...pizzas];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (dietFilter === "veg") {
      filtered = filtered.filter((p) => p.isVeg !== false);
    } else if (dietFilter === "nonveg") {
      filtered = filtered.filter((p) => p.isVeg === false);
    }

    if (sortBy === "priceLow") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "priceHigh") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    if (limit && !showFilters) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  };

  const filteredPizzas = getFilteredAndSortedPizzas();

  const clearAllFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setDietFilter("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== "All" ||
    dietFilter !== "all" ||
    sortBy !== "default";

  const addToCart = async (productId, pizza, cartData = {}) => {
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
        body: JSON.stringify({
          productId,
          size: cartData.size || null,
          portion: cartData.portion || null,
          customPrice: cartData.price || null,
        }),
      });
      if (res.ok) {
        const sizeLabel = cartData.size
          ? ` (${cartData.size.charAt(0).toUpperCase()})`
          : "";
        const portionLabel = cartData.portion ? ` (${cartData.portion})` : "";
        toast.success(
          `${pizza.name}${sizeLabel}${portionLabel} added to cart!`,
        );
        window.dispatchEvent(new Event("cartUpdate"));
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <section className={styles.parentCard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <Pizza size={30} className={styles.headerIcon} />{" "}
            {showFilters ? "Our Menu" : "Our Specialty Items"}
          </h2>
          <p className={styles.sectionSubtitle}>
            {showFilters
              ? "Explore our delicious menu"
              : "Handpicked ingredients for the perfect taste"}
          </p>
        </div>

        {showFilters && (
          <>
            <div className={styles.filtersRow}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    className={styles.clearSearchBtn}
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <CustomSelect
                options={CATEGORIES_LIST}
                value={categoryFilter}
                onChange={setCategoryFilter}
              />

              <CustomSelect
                options={[
                  {
                    label: "All Diet",
                    value: "all",
                    icon: <LayoutGrid size={16} />,
                  },
                  {
                    label: "Veg Only",
                    value: "veg",
                    icon: <Leaf size={16} color="#4caf50" />,
                  },
                  {
                    label: "Non-Veg",
                    value: "nonveg",
                    icon: <Drumstick size={16} color="#e53935" />,
                  },
                ]}
                value={dietFilter}
                onChange={setDietFilter}
              />

              <CustomSelect
                options={[
                  {
                    label: "Sort By",
                    value: "default",
                    icon: <ArrowUpDown size={16} />,
                  },
                  {
                    label: "Price: Low to High",
                    value: "priceLow",
                    icon: (
                      <TrendingUp
                        size={16}
                        style={{ transform: "rotate(180deg)" }}
                      />
                    ),
                  },
                  {
                    label: "Price: High to Low",
                    value: "priceHigh",
                    icon: <TrendingUp size={16} />,
                  },
                  {
                    label: "Top Rated",
                    value: "rating",
                    icon: <Pizza size={16} />,
                  },
                ]}
                value={sortBy}
                onChange={setSortBy}
              />

              {hasActiveFilters && (
                <button className={styles.clearBtn} onClick={clearAllFilters}>
                  <X size={14} /> Clear
                </button>
              )}
            </div>

            {!loading && (
              <div className={styles.resultsInfo}>
                Showing <strong>{filteredPizzas.length}</strong> of{" "}
                <strong>{pizzas.length}</strong> items
              </div>
            )}
          </>
        )}

        <div className={styles.pizzaGrid}>
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, i) => <PizzaSkeleton key={i} />)
          ) : filteredPizzas.length > 0 ? (
            filteredPizzas.map((pizza) => (
              <PizzaCard
                key={pizza._id}
                pizza={pizza}
                addToCart={(cartData) => addToCart(pizza._id, pizza, cartData)}
              />
            ))
          ) : (
            <div className={styles.noResults}>
              <Pizza size={64} strokeWidth={1} />
              <h3>No items found</h3>
              <p>Try adjusting your filters</p>
              <button onClick={clearAllFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ParentCard;
