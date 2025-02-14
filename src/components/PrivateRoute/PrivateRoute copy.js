import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AUTH } from "../../config/dev/Config";
import axios from "axios";

const PrivateRoute = () => {
  const authToken = localStorage.getItem("authToken");
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate(); // Use navigate for manual redirection

  useEffect(() => {
    if (!authToken) {
      setIsValid(false);
      return;
    }

    const checkTokenValidity = async () => {
      try {
        const url = AUTH.INTROSPECT;
        const formData = new FormData();
        formData.append("token", authToken);
    
        const response = await axios.post(url, formData);

        if (response.data && response.data.active) {
          localStorage.setItem("expires", response.data.exp);
          console.log("✅ Token is valid");
          setIsValid(true);
        } else {
          console.log("❌ Invalid token");
          setIsValid(false);
        }
      } catch (error) {
        console.error("❌ Token validation error:", error);
        setIsValid(false);
      }
    };

    checkTokenValidity();
  }, [authToken]);

  // Debugging logs
  console.log("🔍 PrivateRoute - isValid:", isValid);

  if (isValid === null) return <p>Loading...</p>;

  if (!isValid) {
    console.log("🔄 Redirecting to Login");
    navigate("/"); // Ensure immediate navigation
    return null; // Avoid rendering anything after navigation
  }

  return <Outlet />;
};

export default PrivateRoute;
