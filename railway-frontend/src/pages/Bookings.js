import { useEffect, useState } from "react";
import { getBookings, cancelTicket } from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return; // 🔥 prevent call if not logged in

  getBookings().then(res => {
    if (res.success) {
      setBookings(res.data || []);
    } else {
      setBookings([]);
    }
  });
}, []);

  const cancel = async (id) => {
    await cancelTicket(id);
    alert("Cancelled");
  };

  return (
    <div>
      <h2>My Bookings</h2>
      {(bookings || []).length === 0 ? (
  <p>No bookings found</p>
) : (
  (bookings || []).map(b => (
    <div key={b.booking_id}>
      PNR: {b.pnr} → {b.status}
      <button onClick={() => cancel(b.booking_id)}>Cancel</button>
    </div>
  ))
)}
    </div>
  );
}