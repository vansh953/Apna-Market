import React, { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const categoryOptions = {
  Fruits: ["Apple", "Banana", "Mango", "Orange", "Grapes", "Papaya", "Pineapple", "Watermelon", "Strawberry", "Kiwi", "Guava", "Cherry", "Peach", "Lychee", "Pomegranate"],
  Vegetables: ["Tomato","Potato","Carrot","Onion","Cabbage","Spinach","Cauliflower","Peas","Beetroot","Radish","Brinjal","Capsicum","Bottle Gourd","Cucumber","Pumpkin"],
  Dairy: ["Milk","Cheese","Butter","Yogurt","Paneer","Curd","Ghee","Cream","Makhana","Khoa"]
};

export default function FarmerDashboard() {
  const [farmName, setFarmName] = useState(""); 
  const [products, setProducts] = useState([{ category: "", product: "", price: "", quantity: "" }]);
  const navigate = useNavigate();

  const handleAddRow = () => {
    setProducts([...products, { category: "", product: "", price: "", quantity: "" }]);
  };

  const handleRemoveRow = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!farmName.trim()) return alert("Please enter your farm name.");

    try {
      // Check user authentication
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add products.");
        navigate("/login");
        return;
      }

      // Add each product to Firestore
      for (let i = 0; i < products.length; i++) {
        const { category, product, price, quantity } = products[i];
        if (!category || !product || !price || !quantity) {
          alert("All fields are required for each product.");
          return;
        }

        await addDoc(collection(db, "products"), {
          category,
          productName: product,
          price: Number(price),
          quantity: Number(quantity),
          farmName,
          farmerId: user.uid, // 🔥 track who added it
          createdAt: new Date()
        });
      }

      alert("✅ All products added successfully!");
      setProducts([{ category: "", product: "", price: "", quantity: "" }]);
      setFarmName("");
    } catch (error) {
      console.error("❌ Firestore Error:", error);
      alert("Failed to add products: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Error logging out. Try again!");
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      <h2>Farmer Dashboard</h2>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>Logout</button>

      <form onSubmit={handleSubmit}>
        <label>
          Farm Name:
          <input
            type="text"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            placeholder="Enter your farm name"
          />
        </label>
        <br /><br />

        {products.map((p, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px", borderRadius: "10px" }}>
            <label>
              Category:
              <select value={p.category} onChange={(e) => handleChange(index, "category", e.target.value)}>
                <option value="">--Select--</option>
                {Object.keys(categoryOptions).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Product:
              <select
                value={p.product}
                onChange={(e) => handleChange(index, "product", e.target.value)}
                disabled={!p.category}
              >
                <option value="">--Select--</option>
                {p.category && categoryOptions[p.category].map(prod => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Price (₹):
              <input
                type="number"
                value={p.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
                min="1"
              />
            </label>
            <br />
            <label>
              Quantity:
              <input
                type="number"
                value={p.quantity}
                onChange={(e) => handleChange(index, "quantity", e.target.value)}
                min="1"
              />
            </label>
            <br />
            {products.length > 1 && (
              <button type="button" onClick={() => handleRemoveRow(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddRow} style={{ marginRight: "10px" }}>
          ➕ Add Another Product
        </button>
        <button type="submit">✅ Submit All Products</button>
      </form>
    </div>
  );
}
