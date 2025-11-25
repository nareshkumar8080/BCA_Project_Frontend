import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loggedIn = await login(form);
      const defaultRedirect = loggedIn?.role === "admin" ? "/admin" : "/dashboard";
      const redirect = location.state?.from?.pathname || defaultRedirect;
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    }
  };

  return (
    <main className="container">
      <form className="card grid" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="btn" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link to="/reset-password">Reset password</Link>
          <Link to="/register">Need an account? Register</Link>
        </div>
      </form>
    </main>
  );
};

export default Login;


