import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  const primaryCta = isAuthenticated ? "/dashboard" : "/register";
  const secondaryCta = isAuthenticated ? "/previous-rides" : "/login";
  const primaryLabel = isAuthenticated ? "Open dashboard" : "Create account";
  const secondaryLabel = isAuthenticated ? "View previous rides" : "Login to continue";

  return (
    <main className="container grid home-page">
      <section className="card page-hero">
        <div>
          <p className="eyebrow">Realtime verified rides</p>
          <h1 className="hero-title">Campus RideShare</h1>
          <p className="hero-subtitle">
            Discover vetted riders, transparent fares and live availability inside a refined SaaS dashboard. Built for
            premium universities with helpline oversight and responsive escalation.
          </p>
          <div className="hero-actions">
            <Link className="btn" to={primaryCta}>
              {primaryLabel}
            </Link>
            <Link className="btn secondary" to={secondaryCta}>
              {secondaryLabel}
            </Link>
          </div>
          <div className="stats-grid">
            <article className="stat-card">
              <small>Live rides</small>
              <strong>{rides.length}</strong>
              <span>Refreshed continuously</span>
            </article>
            <article className="stat-card">
              <small>Avg. rating</small>
              <strong>4.8</strong>
              <span>Double-sided feedback</span>
            </article>
            <article className="stat-card">
              <small>Price cap</small>
              <strong>₹5/km</strong>
              <span>Transparent fares always</span>
            </article>
          </div>
        </div>

        <div className="card supporting-panel">
          <p className="eyebrow">Why riders love us</p>
          <h3>Full-stack trust and safety</h3>
          <ul className="list-clean">
            <li>OTP-style email verification & JWT protection</li>
            <li>Live ride visibility with gender-aware filters</li>
            <li>Helpline escalation with admin monitoring</li>
            <li>Complaints + ratings after every trip</li>
          </ul>
        </div>
      </section>

      <RideSearch onSearch={searchRides} />

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Live marketplace</p>
            <h2>Available rides</h2>
          </div>
          <span className="badge">{rides.length || 0} open</span>
        </div>
        <div className="rides-grid">
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
        </div>
        {!rides.length && <div className="empty-state">No live rides right now. Try adjusting the filters.</div>}
      </section>

      <section className="insights-grid">
        <article className="insight-card">
          <p className="eyebrow">Smart routing</p>
          <h3>Personalized filters</h3>
          <p>Search by gender, rating, fare ceiling, distance and arrival slots with one tap.</p>
        </article>
        <article className="insight-card">
          <p className="eyebrow">Experience</p>
          <h3>Glassmorphic design</h3>
          <p>Modern dashboard aesthetic with adaptive cards, typography hierarchy and smooth motion.</p>
        </article>
        <article className="insight-card">
          <p className="eyebrow">Support</p>
          <h3>Dedicated helpline</h3>
          <p>Escalate concerns instantly. Admin oversight keeps every ride accountable.</p>
        </article>
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

