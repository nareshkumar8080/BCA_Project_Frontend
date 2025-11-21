import React from "react";
import AddRideModal from "../components/AddRideModal";
import useModal from "../hooks/useModal";

const AddRidePage = () => {
  const modal = useModal(true);

  return (
    <main className="container">
      <div className="card">
        <h1>Add ride</h1>
        <p>Set the ride details. Fare auto-calculates at ₹5/km.</p>
        <button className="btn" onClick={modal.open}>
          Open form
        </button>
      </div>
      <AddRideModal isOpen={modal.isOpen} onClose={modal.close} />
    </main>
  );
};

export default AddRidePage;


