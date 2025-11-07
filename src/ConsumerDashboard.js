import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ConsumerDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedQty, setSelectedQty] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");

  const nav = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), snapshot => {
      const allProducts = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(p => p.quantity > 0);

      setProducts(allProducts);

      if (activeCategory === "All") {
        setFilteredProducts(allProducts);
      } else {
        setFilteredProducts(allProducts.filter(p => p.category === activeCategory));
      }
    });

    return () => unsubscribe();
  }, [activeCategory]);

  const handleFilter = (category) => {
    setActiveCategory(category);
  };

  const handleAddToCart = async (product) => {
    const qty = parseInt(selectedQty[product.id] || 1);
    if (qty <= 0 || qty > product.quantity) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    const productRef = doc(db, "products", product.id);
    await updateDoc(productRef, { quantity: product.quantity - qty });

    setSelectedQty(prev => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      <h2>Consumer Dashboard</h2>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <button onClick={() => nav("/")} style={{ cursor: "pointer" }}>Back</button>
        <button onClick={() => nav("/cart")} style={{ cursor: "pointer" }}>Go to Cart</button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["All", "Fruits", "Vegetables", "Dairy"].map(cat => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            style={{
              padding: "8px 16px",
              borderRadius: "5px",
              border: activeCategory === cat ? "2px solid #1890ff" : "1px solid #ccc",
              background: activeCategory === cat ? "#e6f7ff" : "#fff",
              fontWeight: activeCategory === cat ? "bold" : "normal",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "15px" }}>
        {filteredProducts.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center" }}>No products available</p>
        ) : (
          filteredProducts.map(p => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                background: "#f9f9f9",
                color: "#000"
              }}
            >
              <h3>{p.productName}</h3>
              <p>Category: {p.category}</p>
              <p>Farm: {p.farmName}</p>
              <p>Price: ₹{p.price}</p>
              <p>Available: {p.quantity}</p>
              <input
                type="number"
                min="1"
                max={p.quantity}
                value={selectedQty[p.id] || 1}
                onChange={e => setSelectedQty({ ...selectedQty, [p.id]: e.target.value })}
                style={{ width: "60px", margin: "5px" }}
              />
              <button onClick={() => handleAddToCart(p)} style={{ marginTop: "5px", cursor: "pointer" }}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}