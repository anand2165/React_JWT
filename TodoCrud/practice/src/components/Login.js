// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate ,Link} from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", {email, password});
      const token = response.data.token;
      setToken(token);
      localStorage.setItem("token", token);
      setErrorMessage(null);
      navigate("/crud");
    } catch (error) {
      console.error("Authentication failed:", error);
      const message = error.response?.data?.message || "An unexpected error occurred. Please try again.";
      setErrorMessage(message);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {token && <div style={{ color: "green" }}>Login successful!</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <div>
        <p>If new user then<Link to="/register">register</Link> </p>
      </div>
    </div>
  );
};

export default Login;
    