import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const RideDetails = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/rides/${id}`);
      setRide(data.data);
    };
    load();
  }, [id]);

  if (!ride) return <main className="container">Loading...</main>;

  const riderProfile = typeof ride.riderId === "object" ? ride.riderId : {};

  return (
    <main className="container grid">
      <div className="card">
        <h1>
          {ride.from} → {ride.to}
        </h1>
        <p>
          {ride.date} at {ride.time}
        </p>
        <p>Price: ₹{ride.fare}</p>
        <p>
          Rider: {riderProfile.name || "NA"}
          {riderProfile.rating !== undefined && ` • Rating ${Number(riderProfile.rating).toFixed(1)}/5`}
        </p>
        <p>Contact: {ride.riderContact || riderProfile.phone || "NA"}</p>
      </div>
      <p className="card">
        Complaints and ratings can be submitted from the Previous Rides page once your trip is marked
        as completed.
      </p>
    </main>
  );
};

export default RideDetails;

