import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import FarmerDashboard from "./FarmerDashboard";
import ConsumerDashboard from "./ConsumerDashboard";
import Cart from "./Cart";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
       <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/consumer" element={<ConsumerDashboard />} />
      <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;

