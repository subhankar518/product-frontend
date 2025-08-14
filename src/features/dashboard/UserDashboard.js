import React from "react";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  const { user } = useSelector((s) => s.auth);
  return (
    <div className="p-3 bg-light rounded">
      <h3>Welcome, {user?.fullName || user?.username}</h3>
      <p className="text-muted">
        Use the navbar to manage products and orders.
      </p>
    </div>
  );
}
