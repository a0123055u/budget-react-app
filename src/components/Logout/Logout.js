import React, { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Assuming you have an AuthContext

const LogoutButton = () => {
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear any user data from context or state
    setUser(null);

    // Redirect to login page
    window.location.href = '/login'; // Replace with your login page URL
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
