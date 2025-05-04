import React, { useState, useEffect } from "react";
import "./Income.css";
import { useAuth } from "../TokenService/TokenService"; // Import useAuth to get axiosInstance

function IncomeForm({ onClose }) {
  const { axiosInstance, authToken } = useAuth(); // Get axiosInstance and authToken from AuthContext
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    transaction_type: "income", // Set to income
  });

  useEffect(() => {
    // Fetch categories using axiosInstance
    axiosInstance
      .get("https://app.happybudget.net/budget/api/v1/income/expense/category/?category_type=income", {
        headers: {
          "Authorization": `Bearer ${authToken}`, // Use the authToken from context
        },
      })
      .then((response) => {
        setCategories(response.data); // Update categories state with response data
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, [authToken, axiosInstance]); // Use authToken and axiosInstance as dependencies

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

    // API call to save income transaction using axiosInstance
    axiosInstance
      .post("https://app.happybudget.net/budget/api/v1/transaction/user/", formData, {
        headers: {
          "Authorization": `Bearer ${authToken}`, // Use the authToken from context
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Transaction saved:", response.data);
        onClose(); // Close form after submission
      })
      .catch((err) => {
        console.error("Error saving transaction:", err);
      });
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
