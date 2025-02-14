import React, { useState, useEffect } from "react";
import "./Income.css";

function IncomeForm({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    transaction_type: "income", // Set to income
    user: 100
  });
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetch("http://localhost:8000/budget/api/v1/income/expense/category/?category_type=income", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        console.log("Categories:", data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategory,
      sub_category: "", // Reset sub-category
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);

    // API call to save income transaction
    fetch("http://localhost:8000/budget/api/v1/transaction/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Transaction saved:", data);
        onClose(); // Close form after submission
      })
      .catch((err) => console.error("Error saving transaction:", err));
  };

  const selectedCategory = categories.find(
    (category) => category.id === parseInt(formData.category)
  );
  const subCategories = selectedCategory ? selectedCategory.subcategories : [];

  return (
    <div className="income-form">
      <h2>Add Income</h2>
      <form onSubmit={handleSubmit}>
        <label>Category:</label>
        <select
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
        <select
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

        <div className="form-actions">
          <button type="submit">Save Income</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default IncomeForm;
