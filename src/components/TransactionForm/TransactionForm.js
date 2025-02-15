import React, { useState } from 'react';
import './Transaction.css'; // Import the CSS file

const TransactionForm = ({onClose}) => {
    const [period, setPeriod] = useState('');
    const [showDatePickers, setShowDatePickers] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [transactions, setTransactions] = useState([]); // State to store transactions
    const [showTable, setShowTable] = useState(false); // State to control showing the table
    const [balance, setBalance] = useState(0);
    const token = localStorage.getItem("authToken");
    const [loading, setLoading] = useState(true);

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        setShowDatePickers(e.target.value === 'custom');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let url = "http://localhost:8000/budget/api/v1/balance/";

        // Modify the URL or add parameters based on the selected period
        if (period === 'lastMonth') {
            url += '?last_month=true';
        } else if (period === 'last3Months') {
            url += '?last_three_months=true';
        } else if (period === 'last6Months') {
            url += '?last_six_months=true';
        } else if (period === 'lastYear') {
            url += '?last_year=true';
        } else if (period === 'custom') {
            url += `?start_date=${startDate}&end_date=${endDate}`;
        }

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Fetched transactions:", data.transaction);
            console.log("Type before parsing:", typeof data.transaction);
    
            let transactionsArray = [];
            try {
                transactionsArray = JSON.parse(data.transaction);
            } catch (error) {
                console.error("Error parsing transactions:", error);
            }
    
            console.log("Type after parsing:", typeof transactionsArray);
            console.log("Is Array:", Array.isArray(transactionsArray));
            setTransactions(Array.isArray(transactionsArray) ? transactionsArray : []);
            setBalance(data.balance);
            setLoading(false); // Set loading to false after data is fetched
        })
        .catch((err) => {
            console.error("Error fetching transactions:", err);
            setLoading(false); // Set loading to false in case of error
        });

        setShowTable(true); // Show table when form is submitted
    };

    const isSubmitDisabled = () => {
        if (period === 'custom') {
            return !startDate || !endDate;
        }
        return period === '';
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group inline-form-group">
                <div>
                    <label htmlFor="period">Select Period:</label>
                    <select id="period" value={period} onChange={handlePeriodChange} className="form-control">
                        <option value="">Select</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="last3Months">Last 3 Months</option>
                        <option value="last6Months">Last 6 Months</option>
                        <option value="lastYear">Last Year</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                {showDatePickers && (
                    <>
                        <div>
                            <label htmlFor="startDate">Start Date:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate">End Date:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </>
                )}

                <div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitDisabled()}>Submit</button>
                    
                </div>
                <div><button type="button" onClick={onClose} className="cancel-btn">
                    Cancel
                    </button>
                </div>
                <div>Balance during the selected period: {balance ? balance : 0}</div>
            </div>

            {showTable && transactions && (
                <table className="transaction-table mt-3">
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
                                <td>{transaction.date}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.transaction_type === 'expense' ? `-${Math.abs(parseFloat(transaction.amount))}` : parseFloat(transaction.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </form>
    );
};

export default TransactionForm;