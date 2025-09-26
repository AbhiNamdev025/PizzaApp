import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPath({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null) {
      navigate("/");
    }
  });

  return children;
}

export default ProtectedPath;
