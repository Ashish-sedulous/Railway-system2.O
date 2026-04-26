import { useState } from "react";
import { getSeats, bookTicket } from "../services/api";

export default function Seats() {
  const [scheduleId, setScheduleId] = useState("");
  const [seats, setSeats] = useState([]);

  const fetchSeats = async () => {
    const res = await getSeats(scheduleId);
    setSeats(res.data);
  };

  const book = async () => {
  const res = await bookTicket({ scheduleId });

  if (res && res.success) {
    alert(`Booking ${res.data.status} | PNR: ${res.data.pnr}`);
  } else {
    alert(res?.message || "Booking failed");
  }
};

  return (
    <div>
      <h2>Seats</h2>
      <input placeholder="Schedule ID" onChange={e => setScheduleId(e.target.value)} />
      <button onClick={fetchSeats}>Check Seats</button>

      {seats.map(s => (
        <div key={s.seat_id}>
          Seat {s.seat_number} → {s.status}
        </div>
      ))}

      <button onClick={book}>Book Ticket</button>
    </div>
  );
}