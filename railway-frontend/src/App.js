import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trains from "./pages/Trains";
import Seats from "./pages/Seats";
import Bookings from "./pages/Bookings";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div>
      <h1>Railway System</h1>

      {/* Navigation */}
      <button onClick={() => setPage("login")}>Login</button>
      <button onClick={() => setPage("register")}>Register</button>
      <button onClick={() => setPage("trains")}>Trains</button>
      <button onClick={() => setPage("seats")}>Seats</button>
      <button onClick={() => setPage("bookings")}>Bookings</button>

      {/* Pages */}
      {page === "login" && <Login />}
      {page === "register" && <Register />}
      {page === "trains" && <Trains />}
      {page === "seats" && <Seats />}
      {page === "bookings" && <Bookings />}
    </div>
  );
}

export default App;