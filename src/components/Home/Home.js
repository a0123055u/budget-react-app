import React, { useState, useEffect } from "react";
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import IncomeForm from '../IncomeForm/IncomeForm';
import TransactionForm from '../TransactionForm/TransactionForm'; // Ensure correct import
import "./Home.css";
import { AUTH } from "../../config/dev/Config";
import axios from 'axios';


function Home() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const token = localStorage.getItem("authToken");
  const [userName] = useState(() => {
    try {
      return localStorage.getItem('userName') || 'Guest';
    } catch (e) {
      return 'Guest';
    }
  });

  

  useEffect(() => {
    fetch("http://budgetappalb-1330964985.ap-southeast-1.elb.amazonaws.com:8000/budget/api/v1/balance/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Fetched transactions:", data.last_five_transaction);
        console.log("Type before parsing:", typeof data.last_five_transaction);

        let transactionsArray = [];
        try {
            transactionsArray = JSON.parse(data.last_five_transaction);
        } catch (error) {
            console.error("Error parsing transactions:", error);
        }

        console.log("Type after parsing:", typeof transactionsArray);
        console.log("Is Array:", Array.isArray(transactionsArray));

        setBalance(data.balance);
        setTransactions(Array.isArray(transactionsArray) ? transactionsArray : []);
        setLoading(false); // Set loading to false after data is fetched
    })
    .catch((err) => {
        console.error("Error fetching transactions:", err);
        setLoading(false); // Set loading to false in case of error
    });
}, [token]);

const handleLogout = () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
      console.error("No auth token found");
      return;
  }

  const formData = new URLSearchParams();
  formData.append('token', token);
  formData.append('client_id', AUTH.APP_CLIENT_ID);

  axios.post('http://budgetappalb-1330964985.ap-southeast-1.elb.amazonaws.com:8000/o/revoke_token/', formData, {
      headers: {
          "Content-Type": "application/x-www-form-urlencoded"
      }
  })
  .then((response) => {
      console.log("Logout successful:", response.data);
      localStorage.clear();
      window.location.href = "/";
  })
  .catch((error) => {
      console.error("Error logging out:", error);
  });
};

  const handleExpenseFormToggle = () => {
    setShowExpenseForm(true);
    setShowIncomeForm(false);
    setShowTransactionForm(false);
  };

  const handleIncomeFormToggle = () => {
    setShowIncomeForm(true);
    setShowExpenseForm(false);
    setShowTransactionForm(false);
  };

  const handleTransactionFormToggle = () => {
    setShowIncomeForm(false);
    setShowExpenseForm(false);
    setShowTransactionForm(true);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome, {userName}!</h1>
        {loading ? <p>Loading...</p> : <p>Your current balance is: ${balance}</p>}
      </div>

      <div className="quick-actions">
        <button className={`action-btn ${showExpenseForm ? 'active' : ''}`} onClick={handleExpenseFormToggle}>
          Add Expense
        </button>
        <button className={`action-btn ${showIncomeForm ? 'active' : ''}`} onClick={handleIncomeFormToggle}>
          Add Income
        </button>
        <button className={`action-btn ${showTransactionForm ? 'active' : ''}`} onClick={handleTransactionFormToggle}>
          View Transactions
        </button>
      </div>

      {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} />}
      {showIncomeForm && <IncomeForm onClose={() => setShowIncomeForm(false)} />}

      {!showTransactionForm && !showIncomeForm && !showExpenseForm&& (
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
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.transaction_type === 'expense' ? `-${Math.abs(parseFloat(transaction.amount))}` : parseFloat(transaction.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showTransactionForm && <TransactionForm onClose={() => setShowTransactionForm(false)} />}

      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default Home;