import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { PlusCircle } from "lucide-react";
import styles from "./productfrom.module.css";
import { BASE_URL } from "../../../utils/constant";
import Header from "../../Global/Header/Header";
import Footer from "../../Global/Footer/Footer";

function ProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/product/add`, {
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

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (err) {}
  };

  return (
    <>
      <Header />
      <Box className={styles.loginContainer}>
        <Paper elevation={0} className={styles.loginForm}>
          <Box className={styles.loginHeader}>
            <Typography variant="h2" className={styles.loginTitle} sx={{ fontSize: '2rem' }}>
              Add Products to Pizzaiolo
            </Typography>
            <Typography className={styles.loginSubtitle}>
              Expand our delicious menu
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Product Name"
                name="name"
                value={formData.name}
                onChange={changeHandler}
                required
                sx={{
                   '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
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
                placeholder="Price (Rs.)"
                name="price"
                value={formData.price}
                onChange={changeHandler}
                required
                sx={{
                   '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
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
                placeholder="Image URL"
                name="image"
                value={formData.image}
                onChange={changeHandler}
                required
                sx={{
                   '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#fafafa',
                      '& fieldset': { borderColor: '#f0f0f0' },
                      '&:hover fieldset': { borderColor: '#ff6f61' },
                      '&.Mui-focused fieldset': { borderColor: '#ff6f61' },
                   }
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Description"
                name="description"
                value={formData.description}
                onChange={changeHandler}
                required
                sx={{
                   '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#fafafa',
                      '& fieldset': { borderColor: '#f0f0f0' },
                      '&:hover fieldset': { borderColor: '#ff6f61' },
                      '&.Mui-focused fieldset': { borderColor: '#ff6f61' },
                   }
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<PlusCircle size={20} />}
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
              Add Product
            </Button>
          </form>
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default ProductForm;
