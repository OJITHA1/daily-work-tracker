import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { name, email, password } : { email, password };
      const res = await api.post(endpoint, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "360px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          {isRegister ? "Create Account" : "Daily Work Tracker"}
        </h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input type="text" placeholder="Full Name" value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }} />
          )}
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }} />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "16px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" }} />
          <button type="submit" style={{ width: "100%", padding: "10px", background: "#1976d2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          {isRegister ? "Already have an account? " : "No account? "}
          <span onClick={() => setIsRegister(!isRegister)} style={{ color: "#1976d2", cursor: "pointer" }}>
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
