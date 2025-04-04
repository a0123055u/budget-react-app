import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AUTH } from "../../config/dev/Config";
import axios from "axios";

const PrivateRoute = () => {
  const authToken = localStorage.getItem("authToken");
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate(); // Use navigate for manual redirection

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!authToken) {
        setIsValid(false);
        return;
      }

      try {
        const url = AUTH.INTROSPECT;
        const formData = new FormData();
        formData.append("token", authToken);

        const response = await axios.post(url, formData);

        if (response.data && response.data.active) {
          localStorage.setItem("expires", response.data.exp);
          localStorage.setItem("uuid", response.data.user_id);
          localStorage.setItem("userName", response.data.username);
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
  }, [authToken]); // Dependency array to trigger when authToken changes

  useEffect(() => {
    if (isValid === false) {
      console.log("🔄 Redirecting to Login");
      navigate("/"); // Ensure immediate navigation after the state change
    }
  }, [isValid, navigate]); // Dependency array to trigger when isValid state changes

  // Debugging logs
  console.log("🔍 PrivateRoute - isValid:", isValid);

  if (isValid === null) return <p>Loading...</p>;

  return <Outlet />;
};

export default PrivateRoute;
