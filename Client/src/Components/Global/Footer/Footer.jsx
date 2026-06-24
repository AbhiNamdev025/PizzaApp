import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPizzaSlice,
  FaTruck,
} from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a1a",
        color: "white",
        pt: 8,
        pb: 4,
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FaPizzaSlice style={{ fontSize: '2rem', color: '#ff6f61', marginRight: '12px' }} />
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '1px' }}>
                PIZZAIOLO
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#aaa', mb: 3, maxWidth: '350px', lineHeight: 1.8 }}>
              Authentic Italian pizzas crafted with passion and tradition.
              Experience the taste of Italy delivered fresh to your doorstep.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[
                { icon: <FaFacebook />, label: "Facebook" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaTwitter />, label: "Twitter" },
              ].map((social) => (
                <IconButton
                  key={social.label}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '&:hover': { bgcolor: '#ff6f61' },
                    transition: 'all 0.3s'
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, position: 'relative', '&:after': { content: '""', position: 'absolute', bottom: -8, left: 0, width: 40, height: 2, bgcolor: '#ff6f61' } }}>
              Contact Info
            </Typography>
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FaMapMarkerAlt style={{ color: '#ff6f61', marginTop: '4px', flexShrink: 0 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Address:</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Main Market, Channa Colony Naraingarh, 134203</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FaPhoneAlt style={{ color: '#ff6f61', marginTop: '4px', flexShrink: 0 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Phone:</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>+91 9812409496</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FaEnvelope style={{ color: '#ff6f61', marginTop: '4px', flexShrink: 0 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Email:</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>namdevabhi025@gmail.com</Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Opening Hours */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, position: 'relative', '&:after': { content: '""', position: 'absolute', bottom: -8, left: 0, width: 40, height: 2, bgcolor: '#ff6f61' } }}>
              Opening Hours
            </Typography>
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FaClock style={{ color: '#ff6f61', marginTop: '4px' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>Monday - Friday</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>10:00 AM - 11:00 PM</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FaClock style={{ color: '#ff6f61', marginTop: '4px' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>Saturday - Sunday</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>11:00 AM - 12:00 AM</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, bgcolor: 'rgba(255,111,97,0.1)', p: 2, borderRadius: '12px', border: '1px dashed rgba(255,111,97,0.3)' }}>
                 <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <FaTruck style={{ color: '#ff6f61' }} />
                    <Typography variant="caption" sx={{ color: '#ff6f61', fontWeight: 700 }}>Free delivery on orders above ₹299</Typography>
                 </Stack>
                 <Stack direction="row" spacing={1.5} alignItems="center">
                    <FaClock style={{ color: '#ff6f61' }} />
                    <Typography variant="caption" sx={{ color: '#ff6f61', fontWeight: 700 }}>30-minute delivery guarantee</Typography>
                 </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, position: 'relative', '&:after': { content: '""', position: 'absolute', bottom: -8, left: 0, width: 40, height: 2, bgcolor: '#ff6f61' } }}>
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              {['Home', 'About', 'Products'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  underline="none"
                  sx={{
                    color: '#aaa',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    '&:hover': { color: '#ff6f61', pl: 1 }
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.05)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            © {new Date().getFullYear()} Pizzaiolo - Authentic Italian Pizza. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
             Made in India
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
