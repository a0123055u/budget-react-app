import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("new_password", newPassword);

    try {
      const response = await fetch(
        `http://budgetappalb-1330964985.ap-southeast-1.elb.amazonaws.com:8000/budget/api/v1/reset/password/user/${token}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setMessage(data.error || "Password reset failed. Try again.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2 className="reset-password-heading">Reset Password</h2>
        <p>Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="reset-password-label">New Password</label>
            <input
              type="password"
              name="new_password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="reset-password-input"
              required
            />
          </div>
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
