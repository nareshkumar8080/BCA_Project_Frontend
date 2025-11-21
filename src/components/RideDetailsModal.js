import React from "react";

const helplineNumber = "+91-800-000-0000";

const RideDetailsModal = ({ ride, onClose, onConfirm, isBooking }) => {
  const [bookingMessage, setBookingMessage] = React.useState("");
  React.useEffect(() => {
    setBookingMessage("");
  }, [ride]);
  if (!ride) return null;
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
        <p>Rider mobile: {ride.riderContact || ride.riderId?.phone || "NA"}</p>
        <p>Destination: {ride.to}</p>
        <p>Helpline: {helplineNumber}</p>
        <div className="grid">
          <textarea
            placeholder="Message to rider (drop location / instructions) *Add Your Fare*"
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

