import React, { useState, useEffect } from "react";
import "./Expense.css";

function ExpenseForm({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    transaction_type: "expense",
  });
  const token = localStorage.getItem("authToken");

  // Fetch categories and subcategories from a single API
  useEffect(() => {
    fetch("http://localhost:8000/budget/api/v1/income/expense/category/?category_type=expense", {
      method: "GET", // or "POST", "PUT", "DELETE"
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Adding the auth token
        // "Custom-Header": "customValue", // Any additional headers
      },}) // Adjust API endpoint to match your actual one
    // 
      .then((res) => res.json())
      .then((data) => {
        setCategories(data); // Set entire categories (including subcategories) into state
        console.log("Data", data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [token]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle category change, to reset subcategory when category changes
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategory,
      sub_category: "", // Reset sub-category when category changes
    });
  };

  // Submit form (call API to save transaction)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);

    // API call (optional)
    fetch("http://localhost:8000/budget/api/v1/transaction/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Transaction saved:", data);
        onClose(); // Close form after submission
      })
      .catch((err) => console.error("Error saving transaction:", err));
  };

  // Get the subcategories for the selected category
  const selectedCategory = categories.find(
    (category) => category.id === parseInt(formData.category)
  );
  const subCategories = selectedCategory ? selectedCategory.subcategories : [];

  return (
    <div className="expense-form">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <label>Category:</label>
        <select required
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category}
            </option>
          ))}
          
        </select>

        <label>Sub Category:</label>

        <select required
          name="sub_category"
          value={formData.sub_category}
          onChange={handleChange}
          disabled={!formData.category}
        >
          <option value="">Select Subcategory</option>
          {subCategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.sub_category}
            </option>
          ))}
        </select>

        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* <label>Transaction Type:</label>
        <select
          name="transaction_type"
          value={formData.transaction_type}
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select> */}

        <div className="form-actions">
          <button type="submit">Save Transaction</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
