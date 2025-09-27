import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./loginform.module.css";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:2525/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const userData = await response.json();

      if (response.status === 200) {
        const token = userData.token;
        localStorage.setItem("token", token);
        const userName = userData.user.name;
        localStorage.setItem("userName", userName);
        const role = userData.user.role;
        localStorage.setItem("role", role);

        toast.success("Login successful");
        console.log("Login successful:", userData);

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        toast.error("Wrong Details");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Wrong Details");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginHeader}>
          <h2 className={styles.loginTitle}>Login to Pizzaiolo</h2>
          <p className={styles.loginSubtitle}>
            Welcome back! Sign in to continue your pizza journey.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email Address"
              className={styles.loginInput}
              name="email"
              value={formData.email}
              onChange={changeHandler}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              className={styles.loginInput}
              name="password"
              value={formData.password}
              onChange={changeHandler}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Log In
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
