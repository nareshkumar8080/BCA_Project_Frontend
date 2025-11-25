import React, { useState } from "react";
import RideSearch from "../components/RideSearch";
import RideCard from "../components/RideCard";
import RideDetailsModal from "../components/RideDetailsModal";
import useRides from "../hooks/useRides";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { rides, refresh, setFilters } = useRides();
  const [selectedRide, setSelectedRide] = useState(null);
  const [booking, setBooking] = useState(false);
  const { isAuthenticated } = useAuth();

  const searchRides = (filters) => {
    setFilters(filters);
    refresh(filters);
  };

  const confirmRide = async (bookingMessage) => {
    if (!selectedRide) return;
    setBooking(true);
    try {
      await api.post("/bookings/confirm", {
        rideId: selectedRide._id,
        bookingMessage: bookingMessage?.trim() || undefined,
      });
      alert("Ride confirmed! Helpline: +91-800-000-0000");
      setSelectedRide(null);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to confirm ride");
    } finally {
      setBooking(false);
    }
  };

  return (
    <main className="container grid" style={{ gap: "2rem" }}>
      <div className="card">
        <img src="https://dummyimage.com/600x120/1d4ed8/ffffff&text=Campus+Ride+Share" alt="logo" style={{ width: "100%", borderRadius: "8px" }} />
      </div>
      <RideSearch onSearch={searchRides} />
      <section className="grid">
        {rides.map((ride) => (
          <RideCard
            key={ride._id}
            ride={ride}
            onSelect={(r) => {
              if (!isAuthenticated) {
                alert("Please login to book rides");
                return;
              }
              setSelectedRide(r);
            }}
          />
        ))}
        {!rides.length && <p>No live rides right now.</p>}
      </section>
      <RideDetailsModal
        ride={selectedRide}
        isBooking={booking}
        onConfirm={confirmRide}
        onClose={() => setSelectedRide(null)}
      />
    </main>
  );
};

export default Home;

