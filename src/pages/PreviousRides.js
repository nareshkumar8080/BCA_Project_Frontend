import React, { useEffect, useState } from "react";
import api from "../api";
import RatingModal from "../components/RatingModal";

const PreviousRides = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingTarget, setRatingTarget] = useState(null);
  const [ratingError, setRatingError] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [complaintDrafts, setComplaintDrafts] = useState({});
  const [complaintStatus, setComplaintStatus] = useState({});
  const [complaintSubmitting, setComplaintSubmitting] = useState({});

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/bookings");
      setBookings(data.data);
      return data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load previous rides";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const markCompleted = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/complete`);
      const refreshed = await fetchBookings();
      const updated = refreshed.find((booking) => booking._id === bookingId);
      if (updated?.canRate && !updated.hasRated) {
        setRatingTarget(updated);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to mark ride as completed");
    }
  };

  const toggleComplaint = (bookingId) => {
    setExpandedComplaint((prev) => (prev === bookingId ? null : bookingId));
    setComplaintStatus((prev) => ({ ...prev, [bookingId]: "" }));
  };

  const handleComplaintChange = (bookingId, value) => {
    setComplaintDrafts((prev) => ({ ...prev, [bookingId]: value }));
  };

  const submitComplaint = async (booking) => {
    const bookingId = booking._id;
    const message = (complaintDrafts[bookingId] || "").trim();
    if (!message) {
      setComplaintStatus((prev) => ({ ...prev, [bookingId]: "Please add your complaint details." }));
      return;
    }

    setComplaintSubmitting((prev) => ({ ...prev, [bookingId]: true }));
    setComplaintStatus((prev) => ({ ...prev, [bookingId]: "" }));
    try {
      await api.post("/complaints/add", {
        rideId: booking.rideId?._id || booking.rideId,
        message,
      });
      setComplaintStatus((prev) => ({
        ...prev,
        [bookingId]: "Complaint submitted successfully",
      }));
      setComplaintDrafts((prev) => ({ ...prev, [bookingId]: "" }));
      setExpandedComplaint(null);
    } catch (err) {
      setComplaintStatus((prev) => ({
        ...prev,
        [bookingId]: err.response?.data?.message || "Unable to submit complaint",
      }));
    } finally {
      setComplaintSubmitting((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const openRating = (booking) => {
    if (!booking?.canRate || booking.hasRated) return;
    setRatingError("");
    setRatingTarget(booking);
  };

  const submitRating = async ({ stars, review }) => {
    if (!ratingTarget) return;
    setRatingSubmitting(true);
    setRatingError("");
    try {
      await api.post("/rating/add", {
        rideId: ratingTarget.rideId?._id || ratingTarget.rideId,
        toUserId: ratingTarget.counterparty?._id,
        stars,
        review,
      });
      await fetchBookings();
      setRatingTarget(null);
    } catch (err) {
      setRatingError(err.response?.data?.message || "Unable to submit rating");
    } finally {
      setRatingSubmitting(false);
    }
  };

  return (
    <main className="container grid">
      <h1>Previous rides</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading rides...</p>}
      {!loading && !bookings.length && <p>No rides yet.</p>}

      {bookings.map((booking) => (
        <div key={booking._id} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3>
                {booking.rideId?.from} → {booking.rideId?.to}
              </h3>
              <p>
                {booking.rideId?.date} at {booking.rideId?.time}
              </p>
              <p>Status: {booking.status}</p>
              <p>
                Role: {booking.role === "rider" ? "You were the rider" : "You were the passenger"}
              </p>
              {booking.counterparty?.name && (
                <p>
                  Counterparty: {booking.counterparty.name}
                  {booking.counterparty.rating !== undefined &&
                    ` • Rating ${booking.counterparty.rating}/5`}
                </p>
              )}
              {booking.role === "rider" && booking.bookingMessage && (
                <p>
                  <strong>Passenger instructions:</strong> {booking.bookingMessage}
                </p>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {booking.status !== "completed" && (
                <button className="btn" onClick={() => markCompleted(booking._id)}>
                  Mark completed
                </button>
              )}
              {booking.canRate && !booking.hasRated && (
                <button className="btn secondary" onClick={() => openRating(booking)}>
                  Rate ride
                </button>
              )}
              {booking.status === "completed" && (
                <button className="btn secondary" onClick={() => toggleComplaint(booking._id)}>
                  {expandedComplaint === booking._id ? "Close complaint" : "Add complaint"}
                </button>
              )}
            </div>
          </div>

          {expandedComplaint === booking._id && (
            <div className="grid">
              <textarea
                rows={3}
                value={complaintDrafts[booking._id] || ""}
                placeholder="Describe your complaint"
                onChange={(e) => handleComplaintChange(booking._id, e.target.value)}
              />
              <button
                className="btn"
                onClick={() => submitComplaint(booking)}
                disabled={complaintSubmitting[booking._id]}
              >
                {complaintSubmitting[booking._id] ? "Submitting..." : "Submit complaint"}
              </button>
              {complaintStatus[booking._id] && <small>{complaintStatus[booking._id]}</small>}
            </div>
          )}
        </div>
      ))}

      <RatingModal
        booking={ratingTarget}
        isSubmitting={ratingSubmitting}
        error={ratingError}
        onSubmit={submitRating}
        onClose={() => setRatingTarget(null)}
      />
    </main>
  );
};

export default PreviousRides;
