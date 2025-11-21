import React, { useState } from "react";

const defaultFilters = {
  from: "",
  to: "",
  gender: "",
  date: "",
  maxPrice: "",
  minRating: "",
};

const RideSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState(defaultFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form className="card grid" onSubmit={handleSubmit}>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <label>
          From
          <input name="from" value={filters.from} onChange={handleChange} placeholder="JECRC" />
        </label>
        <label>
          To
          <input name="to" value={filters.to} onChange={handleChange} placeholder="Malviya Nagar" />
        </label>
        <label>
          Destination category
          <select name="gender" value={filters.gender} onChange={handleChange}>
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Arrival date
          <input type="date" name="date" value={filters.date} onChange={handleChange} />
        </label>
        <label>
          Time
          <select name="time" value={filters.time || ""} onChange={handleChange}>
            <option value="">Any</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </label>
        <label>
          Max Price (₹)
          <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} />
        </label>
        <label>
          Min Rating
          <input type="number" min="1" max="5" name="minRating" value={filters.minRating} onChange={handleChange} />
        </label>
      </div>
      <button className="btn" type="submit">
        Search real-time rides
      </button>
    </form>
  );
};

export default RideSearch;

