import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  useEffect(() => {
    const filteredCart = cart.filter((item) => item.quantity > 0);
    if (filteredCart.length !== cart.length) {
      setCart(filteredCart);
      localStorage.setItem("cart", JSON.stringify(filteredCart));
    }

    const sum = filteredCart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  }, [cart]);

  const removeItem = async (index) => {
    const itemToRemove = cart[index];
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    const productRef = doc(db, "products", itemToRemove.id);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const currentQty = productSnap.data().quantity || 0;
      await updateDoc(productRef, { quantity: currentQty + parseInt(itemToRemove.quantity) });
    }
  };

  const increaseQty = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const decreaseQty = (index) => {
    const newCart = [...cart];
    newCart[index].quantity -= 1;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    setCart([]);
    localStorage.removeItem("cart");
  };

  const goBack = () => {
    navigate("/consumer");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Your Cart</h2>

      <button
        onClick={goBack}
        style={{
          marginBottom: "20px",
          background: "#1890ff",
          color: "white",
          border: "none",
          padding: "8px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Back
      </button>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>Cart is empty</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                  color: "#000",
                }}
              >
                <div>
                  <strong>{item.productName}</strong> ({item.category}) <br />
                  Farm: {item.farmName} <br />
                  ₹{item.price} × {item.quantity}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <button
                    onClick={() => decreaseQty(i)}
                    style={{
                      background: "#ff4d4f",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(i)}
                    style={{
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(i)}
                    style={{
                      background: "#555",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderTop: "1px solid #ccc",
            }}
          >
            <h3>Total: ₹{total}</h3>
            <button
              onClick={placeOrder}
              style={{
                background: "#4CAF50",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
