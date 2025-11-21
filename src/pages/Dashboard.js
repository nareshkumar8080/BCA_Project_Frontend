// import React from "react";
// import useRides from "../hooks/useRides";
// import RideCard from "../components/RideCard";
// import AddRideModal from "../components/AddRideModal";
// import useModal from "../hooks/useModal";
// import { useAuth } from "../context/AuthContext";

// const Dashboard = () => {
//   const { rides, refresh } = useRides();
//   const modal = useModal();
//   const { user } = useAuth();

//   return (
//     <main className="container grid" style={{ gap: "1.5rem" }}>
//       <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div>
//           <h2>Welcome back, {user?.name}</h2>
//           <p>Keep adding rides to help your campus commute safer.</p>
//         </div>
//         <button className="btn" onClick={modal.open}>
//           Add Ride
//         </button>
//       </div>
//       <section className="grid">
//         {rides.map((ride) => (
//           <RideCard key={ride._id} ride={ride} />
//         ))}
//       </section>
//       <AddRideModal isOpen={modal.isOpen} onClose={modal.close} onSuccess={refresh} />
//     </main>
//   );
// };

// export default Dashboard;





import React, { useState } from "react";
import useRides from "../hooks/useRides";
import RideCard from "../components/RideCard";
import AddRideModal from "../components/AddRideModal";
import RideDetailsModal from "../components/RideDetailsModal";
import useModal from "../hooks/useModal";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { rides, refresh } = useRides();
  const modal = useModal();
  const { user, isAuthenticated } = useAuth();

  const [selectedRide, setSelectedRide] = useState(null);
  const [booking, setBooking] = useState(false);

  // BOOKING CONFIRM
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
    <main className="container grid" style={{ gap: "1.5rem" }}>

      {/* HEADER + ADD RIDE BUTTON */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Welcome back, {user?.name}</h2>
          <p>Keep adding rides to help your campus commute safer.</p>
        </div>

        <button className="btn" onClick={modal.open}>
          Add Ride
        </button>
      </div>

      {/* ALL RIDES LIST */}
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

        {!rides.length && <p>No rides found.</p>}
      </section>

      {/* ADD RIDE MODAL */}
      <AddRideModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onSuccess={refresh}
      />

      {/* RIDE DETAILS + BOOKING MODAL */}
      <RideDetailsModal
        ride={selectedRide}
        isBooking={booking}
        onConfirm={confirmRide}
        onClose={() => setSelectedRide(null)}
      />
    </main>
  );
};

export default Dashboard;
