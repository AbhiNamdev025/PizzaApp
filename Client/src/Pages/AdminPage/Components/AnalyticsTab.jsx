import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Calendar,
  Filter,
  Clock,
  RefreshCw,
} from "lucide-react";
import styles from "../adminPanel.module.css";
import CustomSelect from "../../../Components/Global/CustomSelect/CustomSelect";

const STATUS_COLORS = {
  Pending: "#f1c40f",
  Confirmed: "#3498db",
  Preparing: "#e67e22",
  "Out for Delivery": "#9b59b6",
  Delivered: "#2ecc71",
  Cancelled: "#e74c3c",
};

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          border: "1px solid rgba(0,0,0,0.05)",
          padding: "12px 16px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#888",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "1rem",
            color: "#1a1a2e",
            fontWeight: 700,
          }}
        >
          {prefix}
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsTab = ({ orders = [], products = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (filterType === "today") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (filterType === "week") {
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        return orderDate >= lastWeek;
      }
      if (filterType === "month") {
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);
        return orderDate >= lastMonth;
      }
      if (filterType === "custom" && dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }
      return true;
    });
  }, [orders, filterType, dateRange]);

  const revenueData = useMemo(() => {
    const data = {};
    const sortedOrders = [...filteredOrders].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    sortedOrders.forEach((order) => {
      if (order.orderStatus !== "Cancelled") {
        const dateObj = new Date(order.createdAt);
        const dateKey = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        data[dateKey] = (data[dateKey] || 0) + order.grandTotal;
      }
    });

    return Object.keys(data).map((key) => ({
      name: key,
      revenue: data[key],
    }));
  }, [filteredOrders]);

  const orderStatusData = useMemo(() => {
    const data = {};
    filteredOrders.forEach((order) => {
      data[order.orderStatus] = (data[order.orderStatus] || 0) + 1;
    });
    return Object.keys(data).map((key) => ({ name: key, value: data[key] }));
  }, [filteredOrders]);

  const topProductsData = useMemo(() => {
    const data = {};
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        data[item.name] = (data[item.name] || 0) + item.quantity;
      });
    });

    return Object.keys(data)
      .map((key) => ({ name: key, sales: data[key] }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [filteredOrders]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <motion.div
      key="analytics"
      className={styles.analyticsSection}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.sectionHeader}>
        <div>
          <h1>Analytics Overview</h1>
          <p className={styles.subtitle}>
            Showing data for:
            <span
              style={{ fontWeight: 600, color: "#ff6f61", marginLeft: "5px" }}
            >
              {filterType === "all"
                ? "All Time"
                : filterType === "custom"
                  ? `${dateRange.start} to ${dateRange.end}`
                  : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </span>
          </p>
        </div>

        <div className={styles.filterControls}>
          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.filterIcon} />
            <CustomSelect
              options={[
                { label: "All Time", value: "all", icon: <Clock size={14} /> },
                {
                  label: "Today",
                  value: "today",
                  icon: <RefreshCw size={14} />,
                },
                {
                  label: "Last 7 Days",
                  value: "week",
                  icon: <Calendar size={14} />,
                },
                {
                  label: "Last 30 Days",
                  value: "month",
                  icon: <Calendar size={14} />,
                },
                {
                  label: "Custom Range",
                  value: "custom",
                  icon: <Filter size={14} />,
                },
              ]}
              value={filterType}
              onChange={setFilterType}
              className={styles.filterCustomSelect}
            />
          </div>

          {filterType === "custom" && (
            <div className={styles.customDateInputs}>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className={styles.dateInput}
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className={styles.dateInput}
              />
            </div>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className={styles.noData}>
          <h3>No Data Found</h3>
          <p>Try adjusting your date filters to see analytics.</p>
        </div>
      ) : (
        <div className={styles.analyticsGrid}>
          {/* Revenue Composed Chart */}
          <motion.div
            className={`${styles.chartCard} ${styles.fullWidth}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.chartHeader}>
              <h3>
                <DollarSign size={20} className={styles.chartIcon} /> Revenue
                Growth
              </h3>
            </div>
            <div className={styles.chartContainer} style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={revenueData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#ff6f61" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#ff9f43"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#aaa", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#aaa", fontSize: 12 }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip content={<CustomTooltip prefix="₹ " />} />
                  <Bar
                    dataKey="revenue"
                    barSize={30}
                    fill="url(#barGradient)"
                    radius={[10, 10, 0, 0]}
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ff4757"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Order Status Donut Chart */}
          <motion.div
            className={styles.chartCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.chartHeader}>
              <h3>
                <ShoppingBag size={20} className={styles.chartIcon} /> Order
                Distribution
              </h3>
            </div>
            <div className={styles.chartContainer} style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={{
                      outerRadius: 110,
                      innerRadius: 75,
                      fillOpacity: 1,
                    }}
                    onMouseEnter={onPieEnter}
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name] || "#ccc"}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: "#555", fontSize: "12px" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Products Bar Chart */}
          <motion.div
            className={styles.chartCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.chartHeader}>
              <h3>
                <TrendingUp size={20} className={styles.chartIcon} /> Top
                Products
              </h3>
            </div>
            <div className={styles.chartContainer} style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{
                      fill: "#555",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  />
                  <Tooltip content={<CustomTooltip prefix="" />} />
                  <Bar
                    dataKey="sales"
                    fill="#ff6f61"
                    radius={[0, 6, 6, 0]}
                    barSize={16}
                    animationDuration={1500}
                  >
                    {topProductsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#colorSales-${index})`}
                      />
                    ))}
                  </Bar>
                  <defs>
                    {topProductsData.map((entry, index) => (
                      <linearGradient
                        key={`colorSales-${index}`}
                        id={`colorSales-${index}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#ff9a8b" />
                        <stop offset="100%" stopColor="#ff6a88" />
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsTab;
