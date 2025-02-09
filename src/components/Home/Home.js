import React, { useState, useEffect } from 'react';
import './Home.css'; // Custom styles for the home page

function Home() {
  // Sample state for demonstration purposes
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userName] = useState('John Doe');

  // Simulate fetching balance and transactions
  useEffect(() => {
    // For demonstration, using static data
    setBalance(2000); // Example balance
    setRecentTransactions([
      { id: 1, description: 'Groceries', amount: -50, date: '2025-02-01' },
      { id: 2, description: 'Salary', amount: 1500, date: '2025-02-01' },
      { id: 3, description: 'Coffee', amount: -5, date: '2025-02-02' },
    ]);
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Optionally, clear any session state or context if used
    // Redirect to login page
    window.location.href = '/'; // Replace with your login page URL
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome, {userName}!</h1>
        <p>Your current balance is: ${balance}</p>
      </div>

      <div className="quick-actions">
        <button className="action-btn">Add Expense</button>
        <button className="action-btn">Add Income</button>
        <button className="action-btn">View Transactions</button>
      </div>

      <div className="transaction-summary">
        <h2>Recent Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount < 0 ? `-${Math.abs(transaction.amount)}` : transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optionally, you could add a budget graph or summary */}
      <div className="budget-summary">
        <h2>Budget Overview</h2>
        {/* Example graph could go here */}
        <div className="budget-chart">
          {/* Placeholder for future budget chart (using libraries like Chart.js or Recharts) */}
          <p>Chart will go here (e.g., expense distribution by category)</p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default Home;
