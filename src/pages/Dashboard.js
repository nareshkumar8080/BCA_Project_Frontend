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



import React, { useState, useEffect } from "react";
import useRides from "../hooks/useRides";
import RideCard from "../components/RideCard";
import AddRideModal from "../components/AddRideModal";
import RideDetailsModal from "../components/RideDetailsModal";
import RideSearch from "../components/RideSearch";
import useModal from "../hooks/useModal";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { rides, refresh, setFilters } = useRides();
  const modal = useModal();
  const { user, isAuthenticated } = useAuth();

  const [selectedRide, setSelectedRide] = useState(null);
  const [booking, setBooking] = useState(false);
  const [deletingRideId, setDeletingRideId] = useState("");
  const [allRides, setAllRides] = useState([]);
  const [loadingAllRides, setLoadingAllRides] = useState(false);

  const isRider = user?.role === "rider";
  const isCustomer = user?.role === "student";

  // For riders: fetch all rides (not just active ones)
  useEffect(() => {
    if (isRider) {
      const fetchAllRides = async () => {
        setLoadingAllRides(true);
        try {
          const { data } = await api.get("/rides/all");
          setAllRides(data.data || []);
        } catch (err) {
          console.error("Failed to fetch rides:", err);
          setAllRides([]);
        } finally {
          setLoadingAllRides(false);
        }
      };
      fetchAllRides();
    }
  }, [isRider]);

  // BOOKING CONFIRM (only for customers)
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

  const handleDeleteRide = async (ride) => {
    if (!window.confirm("Delete this ride? Bookings linked to it will be removed.")) {
      return;
    }
    setDeletingRideId(ride._id);
    try {
      await api.delete(`/rides/${ride._id}`);
      if (isRider) {
        const { data } = await api.get("/rides/all");
        setAllRides(data.data || []);
      } else {
        refresh();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete ride");
    } finally {
      setDeletingRideId("");
    }
  };

  const searchRides = (filters) => {
    setFilters(filters);
    refresh(filters);
  };

  // Display rides based on role
  const displayRides = isRider ? allRides : rides;

  return (
    <main className="container grid home-page">
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{isRider ? "Rider workspace" : "Passenger workspace"}</p>
            <h1 className="page-title">Welcome back, {user?.name}</h1>
            <p className="section-subtitle">
              {isRider
                ? "Publish and manage every ride with instant visibility into bookings, complaints and helpline context."
                : "Search, filter and confirm upcoming rides with transparent pricing, dual ratings and helpline support."}
            </p>
          </div>
          {isRider && (
            <button className="btn" onClick={modal.open}>
              Add ride
            </button>
          )}
        </div>
      </section>

      {isCustomer && <RideSearch onSearch={searchRides} />}

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{isRider ? "All rides" : "Recommended rides"}</p>
            <h2>Your live feed</h2>
          </div>
          <span className="badge">
            {displayRides.length} {displayRides.length === 1 ? "ride" : "rides"}
          </span>
        </div>

        {loadingAllRides && isRider ? (
          <div className="empty-state">Loading rides...</div>
        ) : (
          <div className="rides-grid">
            {displayRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                currentUser={user}
                isDeleting={deletingRideId === ride._id}
                onSelect={(r) => {
                  if (isCustomer) {
                    if (!isAuthenticated) {
                      alert("Please login to book rides");
                      return;
                    }
                    setSelectedRide(r);
                  }
                }}
                onDelete={(r) => {
                  if (deletingRideId && deletingRideId !== r._id) return;
                  handleDeleteRide(r);
                }}
                showBooking={isCustomer}
              />
            ))}
          </div>
        )}

        {!displayRides.length && !loadingAllRides && <div className="empty-state">No rides found.</div>}
      </section>

      {isRider && (
        <AddRideModal
          isOpen={modal.isOpen}
          onClose={modal.close}
          onSuccess={() => {
            refresh();
            if (isRider) {
              api.get("/rides/all").then(({ data }) => {
                setAllRides(data.data || []);
              });
            }
          }}
        />
      )}

      {isCustomer && (
        <RideDetailsModal
          ride={selectedRide}
          isBooking={booking}
          onConfirm={confirmRide}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </main>
  );
};

export default Dashboard;
