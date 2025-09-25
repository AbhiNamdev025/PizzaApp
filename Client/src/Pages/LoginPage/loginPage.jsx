import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "../../Components/Local/LoginForm/loginForm";
import SignUpFrom from "../../Components/Local/SignUpFrom/signUpFrom";

function LoginPage() {
  return (
    <>
      <LoginForm />
      {/* <SignUpFrom /> */}

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

export default LoginPage;
