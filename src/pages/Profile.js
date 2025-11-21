import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const { data } = await api.get(`/rating/${user.id}`);
      setRatings(data.data);
    };
    load();
  }, [user]);

  if (!user) return null;

  return (
    <main className="container grid">
      <div className="card">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Role: {user.role}</p>
        <p>Completed rides: {user.ridesCompleted}</p>
      </div>
      {ratings && (
        <div className="card" id="ratings">
          <h3>Rating summary</h3>
          <p>Average: {ratings.average} / 5 ({ratings.total} reviews)</p>
          <ul>
            {ratings.reviews.map((review) => (
              <li key={review._id}>
                {review.stars}★ by {review.byUser?.name}: {review.review}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default Profile;

