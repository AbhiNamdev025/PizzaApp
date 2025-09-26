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
import Orderpage from "./Pages/OrderPage/Orderpage";
import Confirmation from "./Components/Local/Confirmation/Confirmation";
import ProductForm from "./Components/Local/Products form/ProductForm";
import ProtectedPath from "./ProtectedPath";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedPath>
                <HomePage />
              </ProtectedPath>
            }
          />
          <Route path="/signup" element={<SignUpFrom />} />
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
