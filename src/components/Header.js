import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="card" style={{ borderRadius: 0, marginBottom: "1rem" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: "1.25rem" }}>
          Campus Ride Share
        </Link>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">Ride</NavLink>
              <NavLink to="/previous-rides">List</NavLink>
              <NavLink to="/profile#ratings">Ratings</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <button className="btn secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Registration</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

