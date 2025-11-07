import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Apna Market 🌾</h1>
      <p>You Are Here For:</p>
      <button onClick={() => nav("/login")} style={{ margin: "10px", padding: "10px 20px" }}>
        Login as Farmer
      </button>
      <button onClick={() => nav("/consumer")} style={{ margin: "10px", padding: "10px 20px" }}>
        Visit as Consumer
      </button>
    </div>
  );
}