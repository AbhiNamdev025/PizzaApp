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
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
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
    <Box className={styles.signupContainer}>
      <Paper elevation={0} className={styles.signupForm}>
        <Box className={styles.signupHeader}>
          <Box className={styles.iconCircle}>
            <Pizza size={40} className={styles.headerIcon} />
          </Box>
          <Typography variant="h2" className={styles.signupTitle}>
            Join Pizzaiolo
          </Typography>
          <Typography className={styles.signupSubtitle}>
            Create your account and start your pizza adventure
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} color="#ff6f61" />
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

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Checkbox 
              size="small"
              sx={{ p: 0, mt: 0.3, color: '#ff6f61', '&.Mui-checked': { color: '#ff6f61' } }} 
            />
            <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.5 }}>
              I agree to the{" "}
              <Link to="/terms" style={{ color: '#ff6f61', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" style={{ color: '#ff6f61', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UserPlus size={20} />}
            sx={{
              height: '55px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
              boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)',
              '&:hover': {
                 transform: 'translateY(-2px)',
                 boxShadow: '0 6px 20px rgba(255, 111, 97, 0.4)',
              }
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <Typography sx={{ textAlign: 'center', mt: 3, color: '#666' }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: '#ff6f61', textDecoration: 'none', fontWeight: 600 }}>
            Log In here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default SignUpForm;
