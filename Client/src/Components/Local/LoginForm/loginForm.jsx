import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, LogIn, Pizza, Loader2, Eye, EyeOff } from "lucide-react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Container,
} from "@mui/material";
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
    <Box className={styles.loginContainer}>
      <Paper elevation={0} className={styles.loginForm}>
        <Box className={styles.loginHeader}>
          <Box className={styles.iconCircle}>
            <Pizza size={40} className={styles.headerIcon} />
          </Box>
          <Typography variant="h2" className={styles.loginTitle}>
            Login to Pizzaiolo
          </Typography>
          <Typography className={styles.loginSubtitle}>
            Welcome back! Sign in to continue your pizza journey.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} color="#ff6f61" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                   borderRadius: '12px',
                   height: '55px',
                   backgroundColor: '#fafafa',
                   '& fieldset': { borderColor: '#f0f0f0' },
                   '&:hover fieldset': { borderColor: '#ff6f61' },
                   '&.Mui-focused fieldset': { borderColor: '#ff6f61' },
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="#ff6f61" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                   borderRadius: '12px',
                   height: '55px',
                   backgroundColor: '#fafafa',
                   '& fieldset': { borderColor: '#f0f0f0' },
                   '&:hover fieldset': { borderColor: '#ff6f61' },
                   '&.Mui-focused fieldset': { borderColor: '#ff6f61' },
                }
              }}
            />
          </Box>

          <Box className={styles.forgotPasswordWrapper} sx={{ mb: 3 }}>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className={styles.loginButton}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LogIn size={20} />}
            sx={{
              height: '55px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              mb: 4,
              background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
              boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)',
              '&:hover': {
                 transform: 'translateY(-2px)',
                 boxShadow: '0 6px 20px rgba(255, 111, 97, 0.4)',
              }
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <Typography className={styles.switchText} sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.switchLink}>
            Create one here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginForm;
