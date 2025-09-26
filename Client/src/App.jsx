import Header from "./Components/Global/Header/Header";
import SignUpFrom from "./Components/Local/SignUpFrom/signUpFrom";
import HomePage from "./Pages/HomePage/homePage";
import LoginPage from "./Pages/LoginPage/loginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CartPage from "./Components/Global/Cart/Cart";
import AboutPage from "./Pages/AboutPage/aboutPage";
import ProductsPage from "./Pages/ProductPage/productsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderForm from "./Components/Local/OrderFrom/OrderForm";
import Orderpage from "./Pages/OrderPage/Orderpage";
import Confirmation from "./Components/Local/Confirmation/Confirmation";

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
          <Route path="/product" element={<ProductsPage />} />
          <Route path="/order" element={<Orderpage />} />
           <Route path="/confirmation" element={<Confirmation/>} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
