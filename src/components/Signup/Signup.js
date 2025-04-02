import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await fetch(
        "http://budgetappalb-1330964985.ap-southeast-1.elb.amazonaws.com:8000/budget/api/v1/register/user/",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-heading">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="signup-label">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="signup-input"
              required
            />
          </div>
          <div>
            <label className="signup-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="signup-input"
              required
            />
          </div>
          <div>
            <label className="signup-label">Confirm Password</label>
            <input
              type="password"
              name="password2"
              placeholder="Re-enter password"
              onChange={handleChange}
              className="signup-input"
              required
            />
          </div>
          <div>
            <label className="signup-label">First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              onChange={handleChange}
              className="signup-input"
              required
            />
          </div>
          <div>
            <label className="signup-label">Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              onChange={handleChange}
              className="signup-input"
              required
            />
          </div>
          <div>
            <label className="signup-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="signup-input"
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
