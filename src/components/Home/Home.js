import React, { useState, useEffect } from "react";
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import IncomeForm from '../IncomeForm/IncomeForm'; // Import the IncomeForm component

import "./Home.css";

function Home() {
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userName] = useState(() => {
    try {
      return localStorage.getItem('userName') || 'Guest';
    } catch (e) {
      return 'Guest';
    }
  });
  
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false); // Income form visibility state

  useEffect(() => {
    setBalance(2000);
    setRecentTransactions([
      { id: 1, description: "Groceries", amount: -50, date: "2025-02-01" },
      { id: 2, description: "Salary", amount: 1500, date: "2025-02-01" },
      { id: 3, description: "Coffee", amount: -5, date: "2025-02-02" },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleExpenseFormToggle = () => {
    setShowExpenseForm(true);
    setShowIncomeForm(false); // Hide income form if expense form is shown
  };

  const handleIncomeFormToggle = () => {
    setShowIncomeForm(true);
    setShowExpenseForm(false); // Hide expense form if income form is shown
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome, {userName}!</h1>
        <p>Your current balance is: ${balance}</p>
      </div>

      <div className="quick-actions">
        <button
          className={`action-btn ${showExpenseForm ? 'active' : ''}`} // Add active class to expense button
          onClick={handleExpenseFormToggle}
        >
          Add Expense
        </button>
        <button
          className={`action-btn ${showIncomeForm ? 'active' : ''}`} // Add active class to income button
          onClick={handleIncomeFormToggle}
        >
          Add Income
        </button>
        <button className="action-btn">View Transactions</button>
      </div>

      {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} />}
      {showIncomeForm && <IncomeForm onClose={() => setShowIncomeForm(false)} />} {/* Show Income form if clicked */}

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

      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default Home;
