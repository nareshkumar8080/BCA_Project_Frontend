import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddRide from "./pages/AddRide";
import RideDetails from "./pages/RideDetails";
import Profile from "./pages/Profile";
import PreviousRides from "./pages/PreviousRides";

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ride/:id" element={<RideDetails />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-ride" element={<AddRide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/previous-rides" element={<PreviousRides />} />
      </Route>
    </Routes>
  </>
);

export default App;


