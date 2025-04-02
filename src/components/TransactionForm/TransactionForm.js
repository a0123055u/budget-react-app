import React, { useState } from 'react';
import './Transaction.css'; // Import the CSS file
import { useAuth } from '../TokenService/TokenService';

const TransactionForm = ({ onClose }) => {
    const { axiosInstance } = useAuth();
    const [period, setPeriod] = useState('');
    const [showDatePickers, setShowDatePickers] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        setShowDatePickers(e.target.value === 'custom');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = 'http://budgetappalb-1330964985.ap-southeast-1.elb.amazonaws.com:8000/budget/api/v1/balance/';

        if (period === 'lastMonth') url += '?last_month=true';
        else if (period === 'last3Months') url += '?last_three_months=true';
        else if (period === 'last6Months') url += '?last_six_months=true';
        else if (period === 'lastYear') url += '?last_year=true';
        else if (period === 'custom') url += `?start_date=${startDate}&end_date=${endDate}`;

        try {
            const response = await axiosInstance.get(url);
            console.log("Fetched transactions:", response.data.transaction);
            
            let transactionsArray = [];
            try {
                transactionsArray = JSON.parse(response.data.transaction);
            } catch (error) {
                console.error("Error parsing transactions:", error);
            }

            setTransactions(Array.isArray(transactionsArray) ? transactionsArray : []);
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
            setShowTable(true);
        }
    };

    const isSubmitDisabled = () => (period === 'custom' ? !startDate || !endDate : period === '');

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
                            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-control" />
                        </div>
                        <div>
                            <label htmlFor="endDate">End Date:</label>
                            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-control" />
                        </div>
                    </>
                )}
                <div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitDisabled()}>Submit</button>
                </div>
                <div>
                    <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
                <div>Balance during the selected period: {balance ? balance : 0}</div>
            </div>
            {showTable && transactions.length > 0 && (
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
