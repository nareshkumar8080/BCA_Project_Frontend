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
        <h2>Ride Details</h2>
        <p>
          {ride.from} → {ride.to}
        </p>
        <p>
          Date: {ride.date} | Time: {ride.time}
        </p>
        <p>Price: ₹{ride.fare}</p>
        <p>
          Rider: {riderName}
          {riderRating !== undefined && ` • Rating ${Number(riderRating).toFixed(1)}/5`}
        </p>
        <p>Rider mobile: {riderPhone}</p>
        <p>Destination: {ride.to}</p>
        <p>Helpline: {helplineNumber}</p>
        <div className="grid">
          <textarea
            placeholder="Message to rider (drop location / instructions)"
            rows={3}
            value={bookingMessage}
            onChange={(e) => setBookingMessage(e.target.value)}
          />
          <button className="btn" onClick={() => onConfirm(bookingMessage)} disabled={isBooking}>
            {isBooking ? "Booking..." : "Confirm ride"}
          </button>
          <button className="btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsModal;

