import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, UserPlus, Pizza } from "lucide-react";
import styles from "./signup.module.css";
import { BASE_URL } from "../../../utils/constant";

function SignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

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

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to create account");
      }
    } catch (err) {
      toast.error("Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                  className={styles.signupInput}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className={styles.signupInput}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.signupInput}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
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

            <button type="submit" className={styles.signupButton}>
              <UserPlus size={20} /> Create Account
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
