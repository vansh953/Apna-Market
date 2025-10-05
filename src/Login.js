import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      nav("/farmer");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{isSignUp ? "Sign Up (Farmer)" : "Login (Farmer)"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      </form>
      <p>
        {isSignUp ? "Already have account?" : "Don't have account?"}{" "}
        <button onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? "Login" : "Sign Up"}</button>
      </p>
    </div>
  );
}
