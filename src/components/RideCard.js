import React from "react";
import { Link } from "react-router-dom";

const formatRating = (rating) => {
  if (rating === undefined || rating === null) return "New";
  return `${Number(rating).toFixed(1)}/5`;
};

const RideCard = ({ ride, onSelect, onDelete, currentUser, isDeleting, showBooking = true }) => {
  const riderIdValue = typeof ride.riderId === "string" ? ride.riderId : ride.riderId?._id;
  const canManage = currentUser?.role === "admin" || currentUser?.id === riderIdValue;
  const showRating = ride.riderId?.rating !== undefined;
  const isRider = currentUser?.role === "rider";

  return (
    <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
      <div>
        <h3>
          {ride.from} → {ride.to}
        </h3>
        <p>
          {ride.date} at {ride.time} • {ride.distance} km • ₹{ride.fare}
        </p>
        <small>
          Rider: {ride.riderId?.name} ({ride.riderId?.gender}){showRating && ` • Rating ${formatRating(ride.riderId.rating)}`}
          {ride.status && ` • Status: ${ride.status}`}
        </small>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Link className="btn secondary" to={`/ride/${ride._id}`}>
          Details
        </Link>
        {/* Only show Book button for customers (showBooking prop) */}
        {showBooking && !isRider && (
          <button className="btn" onClick={() => onSelect?.(ride)}>
            Book
          </button>
        )}
        {canManage && (
          <button
            className="btn secondary"
            onClick={() => onDelete?.(ride)}
            style={{ background: "#c62828", color: "#fff" }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RideCard;


