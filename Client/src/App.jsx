import Header from "./Components/Global/Header/Header";
import SignUpFrom from "./Components/Local/SignUpFrom/signUpFrom";
import HomePage from "./Pages/HomePage/homePage";
import LoginPage from "./Pages/LoginPage/loginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CartPage from "./Components/Global/Cart/Cart";
import AboutPage from "./Pages/AboutPage/aboutPage";
import ProductsPage from "./Pages/ProductPage/productsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignUpFrom />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
