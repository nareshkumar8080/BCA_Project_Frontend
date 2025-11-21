import React from "react";
import { Link } from "react-router-dom";

const RideCard = ({ ride, onSelect }) => (
  <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <h3>{ride.from} → {ride.to}</h3>
      <p>
        {ride.date} at {ride.time} • {ride.distance} km • ₹{ride.fare}
      </p>
      <small>Rider: {ride.riderId?.name} ({ride.riderId?.gender})</small>
    </div>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Link className="btn secondary" to={`/ride/${ride._id}`}>
        Details
      </Link>
      <button className="btn" onClick={() => onSelect?.(ride)}>
        Book
      </button>
    </div>
  </div>
);

export default RideCard;


