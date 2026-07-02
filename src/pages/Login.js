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
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">
          {isRegister ? "Create Account" : "Daily Work Tracker"}
        </h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input className="login-input" type="text" placeholder="Full Name" value={name}
              onChange={(e) => setName(e.target.value)} />
          )}
          <input className="login-input" type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input className="login-input" type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="login-btn">
            {isRegister ? "Register" : "Sign in"}
          </button>
        </form>
        <p className="login-switch">
          {isRegister ? "Already have an account? " : "No account? "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Sign in" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
