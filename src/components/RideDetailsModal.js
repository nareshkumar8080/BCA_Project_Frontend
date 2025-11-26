import React from "react";

const helplineNumber = "+91-800-000-0000";

const RideDetailsModal = ({ ride, onClose, onConfirm, isBooking }) => {
  const [bookingMessage, setBookingMessage] = React.useState("");
  React.useEffect(() => {
    setBookingMessage("");
  }, [ride]);
  if (!ride) return null;
  const riderProfile = typeof ride.riderId === "object" ? ride.riderId : {};
  const riderRating = riderProfile.rating;
  const riderName = riderProfile.name || "NA";
  const riderPhone = ride.riderContact || riderProfile.phone || "NA";
  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <p className="eyebrow">Ride summary</p>
        <h2>
          {ride.from} → {ride.to}
        </h2>
        <div className="ride-card__meta meta-spacer">
          <span>
            {ride.date} · {ride.time}
          </span>
          {ride.distance && <span>{ride.distance} km</span>}
          <span>Fare ₹{ride.fare}</span>
        </div>

        <div className="split-panel">
          <div className="stack">
            <div>Rider: {riderName}</div>
            {riderRating !== undefined && <div>Rating: {Number(riderRating).toFixed(1)}/5</div>}
            <div>Contact: {riderPhone}</div>
            <div>Destination: {ride.to}</div>
          </div>
          <div className="card supporting-panel">
            <p className="eyebrow">Safety</p>
            <p className="section-subtitle compact">
              Bookings log to the admin helpline for monitoring. Share your drop details before confirming.
            </p>
            <strong>Helpline {helplineNumber}</strong>
          </div>
        </div>

        <div className="grid">
          <label>
            Message to rider
            <textarea
              placeholder="Add landmark, luggage detail or accessibility help"
              rows={3}
              value={bookingMessage}
              onChange={(e) => setBookingMessage(e.target.value)}
            />
          </label>
          <div className="form-actions">
            <button className="btn" onClick={() => onConfirm(bookingMessage)} disabled={isBooking}>
              {isBooking ? "Booking..." : "Confirm ride"}
            </button>
            <button className="btn secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsModal;

