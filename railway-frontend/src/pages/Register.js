import { useState } from "react";
import { registerUser } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ user_name: "", email: "", password: "" });

  const handleSubmit = async () => {
    const res = await registerUser(form);
    alert(res.success ? "Registered!" : res.message);
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({...form, user_name: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}