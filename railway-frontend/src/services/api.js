const BASE_URL = "http://localhost:8000/api";

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getTrains = async () => {
  const res = await fetch(`${BASE_URL}/trains`);
  return res.json();
};

export const getSeats = async (scheduleId) => {
  const res = await fetch(`${BASE_URL}/seats?scheduleId=${scheduleId}`);
  return res.json();
};

export const bookTicket = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/booking/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const getBookings = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/booking/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

export const cancelTicket = async (bookingId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/booking/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ bookingId })
  });

  return res.json();
};