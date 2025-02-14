import React, { useState } from "react";
import "./Login.css" ;
import { AUTH } from "../../config/dev/Config";
import axios from "axios";
// import Home from "../../Home/Home";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter email and password");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }
    setError("");
    auth(email, password);
    // alert("Login successful! (Replace with API call)");
  };


  const auth = (email, password) => {
    // Define the API endpoint, data, and headers
    const url = AUTH.AUTH_URL; // Replace with your actual API endpoint
    const formData = new FormData();
  formData.append("grant_type", "password");
  formData.append("username", email);
  formData.append("password", password);
  formData.append("client_id", AUTH.APP_CLIENT_ID);  // Replace with your actual client_id
    // Optionally, you can pass a token if required
    // const token = "YOUR_ACCESS_TOKEN"; // Replace with your actual token if needed

    // const headers = {
    //   "Authorization": `Bearer ${token}`,
    //   "Content-Type": "application/json",
    // };

    // Make the POST request with Axios
    axios
      .post(url, formData)
      .then((response) => {
        console.log("Response:", response.data);

        // Handle response (e.g., save token, redirect, etc.)
        if (response.data.access_token) {
          localStorage.setItem("authToken", response.data.access_token); // Store the token
          // alert("Login successful!"); // Replace with actual redirect or UI change
          navigate('/home');
        } else {
          setError("Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Login failed. Please try again.");
      });
  };


  return (
    <div className="container">
      <div className="login-box">
        <h2>Budget App Login</h2>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="login-btn" onClick={handleLogin}>Login</button>
        <div className="extra-buttons">
          <button className="signup-btn">Sign Up</button>
          <button className="forgot-btn">Forgot Password?</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
