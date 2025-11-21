import React, { useState } from "react";
import api from "../api";

const initialState = {
  from: "",
  to: "",
  distance: "",
  date: "",
  time: "",
  seats: 1,
  riderContact: "",
};

const AddRideModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/rides", { ...form, distance: Number(form.distance) });
      setForm(initialState);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add ride");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <h2>Add Ride</h2>
        <form className="grid" onSubmit={handleSubmit}>
          <label>
            From
            <input name="from" value={form.from} onChange={handleChange} required />
          </label>
          <label>
            To
            <input name="to" value={form.to} onChange={handleChange} required />
          </label>
          <label>
            Distance (km)
            <input type="number" name="distance" value={form.distance} onChange={handleChange} required />
          </label>
          <label>
            Date
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </label>
          <label>
            Time (AM/PM)
            <input name="time" value={form.time} onChange={handleChange} placeholder="07:30 PM" required />
          </label>
          <label>
            Seats
            <input type="number" name="seats" min="1" value={form.seats} onChange={handleChange} />
          </label>
          <label>
            Rider Mobile
            <input name="riderContact" value={form.riderContact} onChange={handleChange} />
          </label>
          <p>Auto price: ₹{Number(form.distance || 0) * 5}</p>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save Ride"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRideModal;


