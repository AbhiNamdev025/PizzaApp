import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart,
  LogOut,
  Home,
  Info,
  Pizza,
  ClipboardList,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  User,
  Heart,
} from "lucide-react";
import styles from "./header.module.css";
import logoImage from "../../../assets/Images/Others/Brandlogo.ico";
import { BASE_URL } from "../../../utils/constant";
import { toast } from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;
  const isAdmin = role === "admin";

  const isActive = (path) => location.pathname === path;

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
    }

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdate", handleCartUpdate);
    return () => window.removeEventListener("cartUpdate", handleCartUpdate);
  }, [isLoggedIn]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${BASE_URL}/cart/find`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.length);
      }
    } catch (error) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
    handleClose();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: "Home", path: "/home", icon: <Home size={20} /> },
    { label: "About", path: "/about", icon: <Info size={20} /> },
    { label: "Products", path: "/product", icon: <Pizza size={20} /> },
    { label: "My Orders", path: "/my-orders", icon: <ClipboardList size={20} /> },
  ];

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #f0f0f0', borderRadius: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo Section */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate("/home")}
          >
            <img
              src={logoImage}
              alt="PIZZAIOLO"
              style={{ height: '50px', marginRight: '10px' }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#ff6f61', lineHeight: 1 }}>
                PIZZAIOLO
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, letterSpacing: '1px' }}>
                Authentic Italian Pizza
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="text"
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                   px: 2,
                   borderRadius: '50px',
                   fontWeight: 600,
                   textTransform: 'none',
                   color: isActive(item.path) ? '#ff6f61' : '#555',
                   backgroundColor: isActive(item.path) ? 'rgba(255, 111, 97, 0.05)' : 'transparent',
                   '&:hover': {
                      backgroundColor: 'rgba(255, 111, 97, 0.08)',
                      color: '#ff6f61'
                   },
                   '& .MuiButton-startIcon': {
                      marginRight: 0.8
                   }
                }}
              >
                {item.label}
              </Button>
            ))}
            {isAdmin && (
               <Button
                  variant="text"
                  onClick={() => navigate("/admin")}
                  startIcon={<ShieldCheck size={20} />}
                  sx={{
                    px: 2,
                    borderRadius: '50px',
                    fontWeight: 700,
                    textTransform: 'none',
                    color: isActive("/admin") ? '#ff6f61' : '#e74c3c',
                    backgroundColor: isActive("/admin") ? 'rgba(231, 76, 60, 0.05)' : 'transparent',
                    '&:hover': {
                       backgroundColor: 'rgba(231, 76, 60, 0.08)',
                    }
                  }}
               >
                  Admin
               </Button>
            )}
          </Box>

          {/* Right Section Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Tooltip title="View Cart">
              <IconButton onClick={() => navigate("/cart")} color="inherit">
                <Badge badgeContent={cartCount} color="error" overlap="circular">
                   <ShoppingCart size={24} />
                </Badge>
              </IconButton>
            </Tooltip>

            {isLoggedIn ? (
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <IconButton onClick={handleMenu} sx={{ p: '2px', border: '2px solid #ff6f61' }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff6f61', fontSize: '1rem' }}>
                    {userName?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      minWidth: '200px'
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                     <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{userName}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { navigate("/profile"); handleClose(); }}>
                     <ListItemIcon><User size={18} /></ListItemIcon> My Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate("/wishlist"); handleClose(); }}>
                     <ListItemIcon><Heart size={18} /></ListItemIcon> Wishlist
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: '#e74c3c' }}>
                     <ListItemIcon><LogOut size={18} color="#e74c3c" /></ListItemIcon> Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  borderColor: '#ff6f61',
                  color: '#ff6f61',
                  '&:hover': {
                     backgroundColor: 'rgba(255, 111, 97, 0.05)',
                     borderColor: '#ff6f61',
                  }
                }}
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon size={28} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: '280px', borderRadius: '20px 0 0 20px' } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <Typography variant="h6" sx={{ fontWeight: 800 }}>Menu</Typography>
           <IconButton onClick={() => setMobileMenuOpen(false)}><X size={24} /></IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 1 }}>
           {[...navItems, ...(isAdmin ? [{ label: "Admin", path: "/admin", icon: <ShieldCheck size={20} /> }] : [])].map((item) => (
             <ListItem
                button
                key={item.label}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                sx={{
                   borderRadius: '10px',
                   mb: 0.5,
                   color: isActive(item.path) ? '#ff6f61' : '#555',
                   backgroundColor: isActive(item.path) ? 'rgba(255,111,97,0.05)' : 'transparent',
                }}
             >
                <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
             </ListItem>
           ))}
           <Divider sx={{ my: 1 }} />
           <ListItem
              button
              onClick={() => { navigate("/wishlist"); setMobileMenuOpen(false); }}
              sx={{ borderRadius: '10px' }}
           >
              <ListItemIcon sx={{ minWidth: '40px' }}><Heart size={20} /></ListItemIcon>
              <ListItemText primary="Wishlist" />
           </ListItem>
           <ListItem
              button
              onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}
              sx={{ borderRadius: '10px' }}
           >
              <ListItemIcon sx={{ minWidth: '40px' }}><User size={20} /></ListItemIcon>
              <ListItemText primary="Profile" />
           </ListItem>
        </List>
        <Box sx={{ mt: 'auto', p: 2 }}>
           {isLoggedIn && (
             <Button
                fullWidth
                variant="contained"
                startIcon={<LogOut size={18} />}
                onClick={handleLogout}
                sx={{
                   borderRadius: '12px',
                   bgcolor: '#f5f5f5',
                   color: '#555',
                   boxShadow: 'none',
                   '&:hover': { bgcolor: '#eee' }
                }}
             >
                Logout
             </Button>
           )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
