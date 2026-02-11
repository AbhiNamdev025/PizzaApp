import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Pizza,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import styles from "./signup.module.css";
import { BASE_URL } from "../../../utils/constant";

function SignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) {
      newErrors.name = "Full name is required";
    }

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
      const response = await fetch(`${BASE_URL}/user/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully");
        setFormData({ name: "", email: "", password: "" });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Failed to create account");
      }
    } catch (err) {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <>
      <div className={styles.signupContainer}>
        <div className={styles.signupForm}>
          <div className={styles.signupHeader}>
            <div className={styles.iconCircle}>
              <Pizza size={40} className={styles.headerIcon} />
            </div>
            <h2 className={styles.signupTitle}>Join Pizzaiolo</h2>
            <p className={styles.signupSubtitle}>
              Create your account and start your pizza adventure
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`${styles.signupInput} ${errors.name ? styles.errorInput : ""}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className={`${styles.signupInput} ${errors.email ? styles.errorInput : ""}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  className={`${styles.signupInput} ${errors.password ? styles.errorInput : ""}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className={styles.terms}>
              <label className={styles.termsLabel}>
                <input type="checkbox" required />I agree to the{" "}
                <a href="#terms" className={styles.termsLink}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className={styles.termsLink}>
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className={styles.signupButton}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className={styles.spinner} size={20} />
              ) : (
                <UserPlus size={20} />
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link to="/" className={styles.switchLink}>
              Log In here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
