import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, LogIn, Pizza, Loader2, Eye, EyeOff } from "lucide-react";
import styles from "./loginform.module.css";
import { BASE_URL } from "../../../utils/constant";
import { registerPushNotifications } from "../../../utils/pushNotifications";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const userData = await response.json();

      if (response.status === 200) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userName", userData.user.name);
        localStorage.setItem("role", userData.user.role);
        localStorage.setItem("userId", userData.user._id);

        // Register for push notifications
        registerPushNotifications(userData.user._id);
        if (userData.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        toast.error(userData.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginHeader}>
          <div className={styles.iconCircle}>
            <Pizza size={40} className={styles.headerIcon} />
          </div>
          <h2 className={styles.loginTitle}>Login to Pizzaiolo</h2>
          <p className={styles.loginSubtitle}>
            Welcome back! Sign in to continue your pizza journey.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className={`${styles.loginInput} ${errors.email ? styles.errorInput : ""}`}
                name="email"
                value={formData.email}
                onChange={changeHandler}
                required
                disabled={loading}
              />
            </div>
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`${styles.loginInput} ${errors.password ? styles.errorInput : ""}`}
                name="password"
                value={formData.password}
                onChange={changeHandler}
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div className={styles.forgotPasswordWrapper}>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className={styles.spinner} size={20} />
            ) : (
              <LogIn size={20} />
            )}
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.switchLink}>
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
