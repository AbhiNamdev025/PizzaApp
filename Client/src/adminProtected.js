import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminProtected({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if ( role === admin) {
      navigate("/addproduct");
    }else{
      navigate("/home")
    }
  });

  return children;
}

export default AdminProtected;
