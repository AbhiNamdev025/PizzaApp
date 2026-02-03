import Header from "./Components/Global/Header/Header";
import SignUpForm from "./Components/Local/SignUpForm/signUpForm";
import HomePage from "./Pages/HomePage/homePage";
import LoginPage from "./Pages/LoginPage/loginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CartPage from "./Components/Global/Cart/Cart";
import AboutPage from "./Pages/AboutPage/aboutPage";
import ProductsPage from "./Pages/ProductPage/productsPage";
import { Toaster } from "react-hot-toast";
import Orderpage from "./Pages/OrderPage/Orderpage";
import Confirmation from "./Components/Local/Confirmation/Confirmation";
import ProductForm from "./Components/Local/Products form/ProductForm";
import ProtectedPath from "./ProtectedPath";
import AdminPanel from "./Pages/AdminPage/AdminPanel";
import MyOrders from "./Pages/MyOrdersPage/MyOrders";
import ProductDetails from "./Pages/ProductDetailsPage/ProductDetails";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import WishlistPage from "./Pages/WishlistPage/WishlistPage";
import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./Components/Global/ScrollToTop/ScrollToTop";

const AppContent = () => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setProgress(30);
    setTimeout(() => setProgress(100), 500);
  }, [location]);

  return (
    <>
      <ScrollToTop />
      <LoadingBar
        color="#ff6f61"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={3}
      />
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedPath>
              <HomePage />
            </ProtectedPath>
          }
        />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedPath>
              <CartPage />
            </ProtectedPath>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedPath>
              <AboutPage />
            </ProtectedPath>
          }
        />
        <Route
          path="/product"
          element={
            <ProtectedPath>
              <ProductsPage />
            </ProtectedPath>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedPath>
              <ProductDetails />
            </ProtectedPath>
          }
        />
        <Route
          path="/addproduct"
          element={
            <ProtectedPath>
              <ProductForm />
            </ProtectedPath>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedPath>
              <Orderpage />
            </ProtectedPath>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedPath>
              <Confirmation />
            </ProtectedPath>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedPath>
              <AdminPanel />
            </ProtectedPath>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedPath>
              <MyOrders />
            </ProtectedPath>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedPath>
              <ProfilePage />
            </ProtectedPath>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedPath>
              <WishlistPage />
            </ProtectedPath>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
